// Transaction batching utility for optimizing micro-tips

import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { tipApi } from './api'
import { handleError, ERROR_CODES } from './errorHandler'

export class TransactionBatcher {
  constructor(connection, wallet, options = {}) {
    this.connection = connection
    this.wallet = wallet
    this.options = {
      maxBatchSize: options.maxBatchSize || 10,
      batchTimeout: options.batchTimeout || 5000, // 5 seconds
      maxRetries: options.maxRetries || 3,
      ...options
    }
    
    this.pendingTips = []
    this.batchTimer = null
    this.isProcessing = false
  }

  // Add tip to batch queue
  async queueTip(recipientAddress, amount, message = '', metadata = {}) {
    if (!this.wallet.publicKey || !this.connection) {
      throw handleError(new Error('Wallet not connected'), { 
        code: ERROR_CODES.WALLET_NOT_CONNECTED 
      })
    }

    const tip = {
      id: this.generateTipId(),
      recipientAddress,
      amount,
      message,
      metadata,
      timestamp: Date.now(),
      status: 'queued'
    }

    this.pendingTips.push(tip)

    // Start batch timer if not already running
    if (!this.batchTimer) {
      this.startBatchTimer()
    }

    // Process immediately if batch is full
    if (this.pendingTips.length >= this.options.maxBatchSize) {
      this.clearBatchTimer()
      await this.processBatch()
    }

    return tip.id
  }

  // Process batch of tips
  async processBatch() {
    if (this.isProcessing || this.pendingTips.length === 0) {
      return
    }

    this.isProcessing = true
    const batchTips = [...this.pendingTips]
    this.pendingTips = []

    try {
      // Create batch transaction
      const transaction = await this.createBatchTransaction(batchTips)
      
      // Send transaction
      const signature = await this.sendBatchTransaction(transaction)
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed')
      
      // Update tip statuses
      batchTips.forEach(tip => {
        tip.status = 'confirmed'
        tip.signature = signature
      })

      // Save to backend
      await this.saveBatchToBackend(batchTips, signature)

      console.log(`Batch processed successfully: ${batchTips.length} tips, signature: ${signature}`)
      
      return {
        success: true,
        signature,
        tips: batchTips,
        totalAmount: batchTips.reduce((sum, tip) => sum + tip.amount, 0)
      }

    } catch (error) {
      // Mark tips as failed
      batchTips.forEach(tip => {
        tip.status = 'failed'
        tip.error = error.message
      })

      console.error('Batch processing failed:', error)
      throw handleError(error, { 
        context: 'batch_processing',
        batchSize: batchTips.length 
      })
    } finally {
      this.isProcessing = false
    }
  }

  // Create batch transaction
  async createBatchTransaction(tips) {
    const transaction = new Transaction()
    
    for (const tip of tips) {
      try {
        const recipientPubkey = new PublicKey(tip.recipientAddress)
        const lamports = Math.floor(tip.amount * LAMPORTS_PER_SOL)
        
        if (lamports <= 0) {
          throw new Error(`Invalid amount for tip ${tip.id}: ${tip.amount}`)
        }

        // Add transfer instruction
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: this.wallet.publicKey,
            toPubkey: recipientPubkey,
            lamports,
          })
        )
      } catch (error) {
        throw new Error(`Failed to create instruction for tip ${tip.id}: ${error.message}`)
      }
    }

    // Set recent blockhash and fee payer
    const { blockhash } = await this.connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = this.wallet.publicKey

    return transaction
  }

  // Send batch transaction
  async sendBatchTransaction(transaction) {
    let lastError
    
    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        const signature = await this.wallet.sendTransaction(transaction, this.connection)
        return signature
      } catch (error) {
        lastError = error
        console.warn(`Batch transaction attempt ${attempt} failed:`, error.message)
        
        if (attempt < this.options.maxRetries) {
          // Wait before retry with exponential backoff
          await this.sleep(1000 * Math.pow(2, attempt - 1))
        }
      }
    }

    throw lastError
  }

  // Save batch to backend
  async saveBatchToBackend(tips, signature) {
    try {
      const batchData = {
        signature,
        tips: tips.map(tip => ({
          recipientAddress: tip.recipientAddress,
          amount: tip.amount,
          message: tip.message,
          metadata: tip.metadata,
          timestamp: tip.timestamp
        })),
        totalAmount: tips.reduce((sum, tip) => sum + tip.amount, 0),
        batchSize: tips.length,
        processedAt: new Date().toISOString()
      }

      await tipApi.batch(batchData)
    } catch (error) {
      console.error('Failed to save batch to backend:', error)
      // Don't throw here as the blockchain transaction succeeded
    }
  }

  // Start batch timer
  startBatchTimer() {
    this.batchTimer = setTimeout(async () => {
      this.batchTimer = null
      if (this.pendingTips.length > 0) {
        await this.processBatch()
      }
    }, this.options.batchTimeout)
  }

  // Clear batch timer
  clearBatchTimer() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }
  }

  // Force process current batch
  async flushBatch() {
    this.clearBatchTimer()
    if (this.pendingTips.length > 0) {
      return await this.processBatch()
    }
    return null
  }

  // Get batch status
  getBatchStatus() {
    return {
      pendingCount: this.pendingTips.length,
      isProcessing: this.isProcessing,
      hasTimer: !!this.batchTimer,
      nextBatchIn: this.batchTimer ? this.options.batchTimeout : null
    }
  }

  // Generate unique tip ID
  generateTipId() {
    return `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Utility sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Cleanup
  destroy() {
    this.clearBatchTimer()
    this.pendingTips = []
    this.isProcessing = false
  }
}

// Hook factory for using transaction batcher (import React in component that uses this)
export const createTransactionBatcherHook = (React) => {
  return (connection, wallet, options = {}) => {
    const [batcher, setBatcher] = React.useState(null)
    const [status, setStatus] = React.useState({
      pendingCount: 0,
      isProcessing: false
    })

    // Initialize batcher
    React.useEffect(() => {
      if (connection && wallet?.publicKey) {
        const newBatcher = new TransactionBatcher(connection, wallet, options)
        setBatcher(newBatcher)

        return () => {
          newBatcher.destroy()
        }
      } else {
        setBatcher(null)
      }
    }, [connection, wallet?.publicKey])

    // Update status periodically
    React.useEffect(() => {
      if (!batcher) return

      const updateStatus = () => {
        setStatus(batcher.getBatchStatus())
      }

      updateStatus()
      const interval = setInterval(updateStatus, 1000)

      return () => clearInterval(interval)
    }, [batcher])

    const queueTip = React.useCallback(async (recipientAddress, amount, message, metadata) => {
      if (!batcher) {
        throw new Error('Batcher not initialized')
      }
      return await batcher.queueTip(recipientAddress, amount, message, metadata)
    }, [batcher])

    const flushBatch = React.useCallback(async () => {
      if (!batcher) return null
      return await batcher.flushBatch()
    }, [batcher])

    return {
      queueTip,
      flushBatch,
      status,
      isReady: !!batcher
    }
  }
}

export default TransactionBatcher
