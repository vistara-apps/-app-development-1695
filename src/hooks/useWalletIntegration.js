import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useState, useEffect, useCallback } from 'react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

export const useWalletIntegration = () => {
  const { publicKey, connected, disconnect, sendTransaction: walletSendTransaction } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return

    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [publicKey, connection])

  // Update balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
    } else {
      setBalance(0)
    }
  }, [connected, publicKey, fetchBalance])

  // Send SOL tip transaction
  const sendTip = useCallback(async (recipientAddress, amount, message = '') => {
    if (!publicKey || !connection || !connected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    
    try {
      // Validate recipient address
      let recipientPubkey
      try {
        recipientPubkey = new PublicKey(recipientAddress)
      } catch (error) {
        throw new Error('Invalid recipient address')
      }

      // Convert SOL to lamports
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL)
      
      if (lamports <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Send transaction
      const signature = await walletSendTransaction(transaction, connection)
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      // Update balance after successful transaction
      await fetchBalance()

      return {
        signature,
        amount,
        recipient: recipientAddress,
        message,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [publicKey, connection, connected, walletSendTransaction, fetchBalance])

  // Format public key for display
  const formatPublicKey = useCallback((pubkey) => {
    if (!pubkey) return ''
    const key = pubkey.toString()
    return `${key.slice(0, 4)}...${key.slice(-4)}`
  }, [])

  return {
    // Wallet state
    connected,
    publicKey,
    balance,
    loading,
    
    // Actions
    disconnect,
    sendTip,
    fetchBalance,
    
    // Utilities
    formatPublicKey: () => formatPublicKey(publicKey),
    
    // Connection info
    connection
  }
}
