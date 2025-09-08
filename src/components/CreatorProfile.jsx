import React, { useState } from 'react'
import { Settings, Eye, TrendingUp, Users, Zap, Copy, ExternalLink } from 'lucide-react'

const CreatorProfile = () => {
  const [isCreator, setIsCreator] = useState(true)
  const [profileData, setProfileData] = useState({
    username: '@creator.sol',
    displayName: 'Creator Name',
    bio: 'Digital artist and content creator passionate about blockchain technology.',
    totalEarnings: 15.67,
    totalTips: 234,
    followers: 1250,
    avgTipAmount: 0.067
  })

  const recentTips = [
    {
      id: 1,
      from: '@alice.eth',
      amount: 0.1,
      message: 'Love your artwork!',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      from: '@bob.sol',
      amount: 0.05,
      message: 'Great tutorial series',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      from: '@charlie.nft',
      amount: 0.2,
      message: 'Keep up the amazing work!',
      timestamp: '6 hours ago'
    }
  ]

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (!isCreator) {
    return (
      <div className="text-center py-12">
        <div className="glass rounded-lg p-8 max-w-md mx-auto">
          <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">
            Become a Creator
          </h2>
          <p className="text-white/70 mb-6">
            Start receiving tips from your followers and monetize your content.
          </p>
          <button
            onClick={() => setIsCreator(true)}
            className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium transition-all duration-200"
          >
            Enable Creator Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Creator Dashboard
        </h1>
        <button className="flex items-center space-x-2 glass text-white px-4 py-2 rounded-md hover:bg-white/20 transition-all duration-200">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Profile Overview */}
      <div className="glass rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-2xl text-white font-bold">
            C
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
              <h2 className="text-white text-xl font-semibold">{profileData.displayName}</h2>
              <span className="text-accent text-sm font-medium">{profileData.username}</span>
            </div>
            <p className="text-white/70 mb-3">{profileData.bio}</p>
            
            <div className="flex items-center space-x-1 text-white/60">
              <span className="text-sm">Wallet:</span>
              <code className="text-xs bg-white/10 px-2 py-1 rounded">
                9WzD...AWWM
              </code>
              <button 
                onClick={() => copyToClipboard('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM')}
                className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-md hover:bg-accent/30 transition-all duration-200">
            <Eye className="h-4 w-4" />
            <span>View Public Profile</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-md">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Earnings</p>
              <p className="text-white text-lg font-semibold">{profileData.totalEarnings} SOL</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-md">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Tips</p>
              <p className="text-white text-lg font-semibold">{profileData.totalTips}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-md">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Followers</p>
              <p className="text-white text-lg font-semibold">{profileData.followers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-md">
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Avg Tip</p>
              <p className="text-white text-lg font-semibold">{profileData.avgTipAmount} SOL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tips */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-semibold">Recent Tips</h3>
          <button className="text-accent hover:text-accent/80 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentTips.map((tip) => (
            <div key={tip.id} className="flex items-center justify-between p-3 bg-white/5 rounded-md hover:bg-white/10 transition-all duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white font-medium">{tip.from}</span>
                  <span className="text-accent font-semibold">{tip.amount} SOL</span>
                </div>
                {tip.message && (
                  <p className="text-white/70 text-sm">{tip.message}</p>
                )}
              </div>
              <span className="text-white/50 text-xs">{tip.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreatorProfile