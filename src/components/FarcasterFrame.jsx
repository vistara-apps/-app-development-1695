import React, { useState, useEffect } from 'react'
import { Heart, Zap, Share2 } from 'lucide-react'
import { useWalletIntegration } from '../hooks/useWalletIntegration'

const FarcasterFrame = ({ frameData, onAction }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [tipAmount, setTipAmount] = useState(0.01)
  const [showTipSelector, setShowTipSelector] = useState(false)
  const { connected, sendTip, loading } = useWalletIntegration()

  // Frame metadata for Farcaster
  const frameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': frameData?.image || '/api/frame/image',
    'fc:frame:button:1': 'Like & Tip',
    'fc:frame:button:2': 'Share',
    'fc:frame:post_url': '/api/frame/action',
    'og:image': frameData?.image || '/api/frame/image',
  }

  // Handle like action with optional tip
  const handleLikeAction = async () => {
    if (!connected) {
      // Trigger wallet connection
      onAction?.({ type: 'connect_wallet' })
      return
    }

    setIsLiked(true)
    
    // Send tip if amount is set
    if (tipAmount > 0 && frameData?.creator?.address) {
      try {
        const result = await sendTip(frameData.creator.address, tipAmount, 'Liked your post!')
        
        // Notify parent component of successful tip
        onAction?.({
          type: 'tip_sent',
          data: {
            recipient: frameData.creator.address,
            amount: tipAmount,
            signature: result.signature,
            postId: frameData.id
          }
        })
      } catch (error) {
        console.error('Tip failed:', error)
        onAction?.({ type: 'tip_failed', error: error.message })
      }
    }

    // Track like action
    onAction?.({
      type: 'like',
      data: {
        postId: frameData.id,
        creator: frameData.creator?.username,
        tipped: tipAmount > 0
      }
    })
  }

  // Handle share action
  const handleShare = () => {
    onAction?.({
      type: 'share',
      data: {
        postId: frameData.id,
        url: frameData.url || window.location.href
      }
    })
  }

  // Render frame metadata for Farcaster client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add frame metadata to document head
      Object.entries(frameMetadata).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', property)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', content)
      })
    }
  }, [frameData])

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      {/* Frame Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {frameData?.creator?.avatar || '👤'}
        </div>
        <div>
          <h3 className="text-white font-medium">
            {frameData?.creator?.username || '@creator'}
          </h3>
          <p className="text-white/60 text-sm">
            {frameData?.timestamp || 'Just now'}
          </p>
        </div>
      </div>

      {/* Frame Content */}
      <div className="mb-4">
        {frameData?.image && (
          <img 
            src={frameData.image} 
            alt="Frame content"
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
        )}
        <p className="text-white/90">
          {frameData?.content || 'Check out this amazing content!'}
        </p>
      </div>

      {/* Frame Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like & Tip Button */}
          <button
            onClick={handleLikeAction}
            disabled={loading}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${isLiked 
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">
              {loading ? 'Tipping...' : isLiked ? 'Liked' : 'Like'}
            </span>
            {tipAmount > 0 && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                +{tipAmount} SOL
              </span>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Tip Amount Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">Tip:</span>
          <select
            value={tipAmount}
            onChange={(e) => setTipAmount(parseFloat(e.target.value))}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent"
          >
            <option value={0}>No tip</option>
            <option value={0.01}>0.01 SOL</option>
            <option value={0.05}>0.05 SOL</option>
            <option value={0.1}>0.1 SOL</option>
            <option value={0.5}>0.5 SOL</option>
          </select>
        </div>
      </div>

      {/* Connection Status */}
      {!connected && (
        <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
          Connect your wallet to send tips
        </div>
      )}
    </div>
  )
}

export default FarcasterFrame
