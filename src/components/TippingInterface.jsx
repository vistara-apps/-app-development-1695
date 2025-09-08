import React, { useState } from 'react'
import { Send, Heart, Users, Zap } from 'lucide-react'
import TipAmountSelector from './TipAmountSelector'
import TransactionStatusIndicator from './TransactionStatusIndicator'
import { useWallet } from './WalletProvider'

const TippingInterface = () => {
  const [selectedAmount, setSelectedAmount] = useState(0.1)
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [transactionStatus, setTransactionStatus] = useState(null)
  const { connected, sendTransaction } = useWallet()

  const handleSendTip = async () => {
    if (!connected || !recipient || selectedAmount <= 0) return

    setTransactionStatus('pending')
    
    try {
      const result = await sendTransaction(selectedAmount, recipient)
      setTransactionStatus('success')
      
      // Reset form
      setTimeout(() => {
        setRecipient('')
        setMessage('')
        setTransactionStatus(null)
      }, 3000)
    } catch (error) {
      setTransactionStatus('error')
      setTimeout(() => setTransactionStatus(null), 3000)
    }
  }

  const mockPosts = [
    {
      id: 1,
      author: '@alice.eth',
      content: 'Just minted my latest NFT collection! 🎨 What do you think?',
      likes: 42,
      tips: 12,
      avatar: '🎨'
    },
    {
      id: 2,
      author: '@bob.sol',
      content: 'New Solana tutorial is live! Learn how to build dApps from scratch.',
      likes: 89,
      tips: 23,
      avatar: '👨‍💻'
    },
    {
      id: 3,
      author: '@charlie.nft',
      content: 'GM! Beautiful sunrise today ☀️ Hope everyone has a great day!',
      likes: 156,
      tips: 45,
      avatar: '🌅'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Send Tips to Creators
        </h1>
        <p className="text-white/80">
          Support your favorite creators with instant micro-tips
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tipping Form */}
        <div className="lg:col-span-1">
          <div className="glass rounded-lg p-6 space-y-6">
            <h3 className="text-white text-lg font-semibold">Send a Tip</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Recipient
                </label>
                <input
                  type="text"
                  placeholder="@username or wallet address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Amount (SOL)
                </label>
                <TipAmountSelector 
                  selectedAmount={selectedAmount}
                  onAmountChange={setSelectedAmount}
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Message (optional)
                </label>
                <textarea
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {transactionStatus && (
                <TransactionStatusIndicator status={transactionStatus} />
              )}

              <button
                onClick={handleSendTip}
                disabled={!connected || !recipient || selectedAmount <= 0 || transactionStatus === 'pending'}
                className="w-full bg-accent hover:bg-accent/90 disabled:bg-white/10 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>
                  {transactionStatus === 'pending' ? 'Sending...' : `Send ${selectedAmount} SOL`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Social Feed */}
        <div className="lg:col-span-2">
          <div className="glass rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-6">Creator Feed</h3>
            
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-medium">{post.author}</span>
                        <span className="text-white/50 text-sm">•</span>
                        <span className="text-white/50 text-sm">2h ago</span>
                      </div>
                      
                      <p className="text-white/90 mb-3">{post.content}</p>
                      
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => setRecipient(post.author)}
                          className="flex items-center space-x-1 text-white/70 hover:text-accent transition-colors duration-200"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        
                        <button 
                          onClick={() => setRecipient(post.author)}
                          className="flex items-center space-x-1 text-white/70 hover:text-accent transition-colors duration-200"
                        >
                          <Zap className="h-4 w-4" />
                          <span className="text-sm">{post.tips} tips</span>
                        </button>
                        
                        <button 
                          onClick={() => setRecipient(post.author)}
                          className="ml-auto bg-accent/20 hover:bg-accent/30 text-accent px-3 py-1 rounded-md text-sm font-medium transition-all duration-200"
                        >
                          Quick Tip
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TippingInterface