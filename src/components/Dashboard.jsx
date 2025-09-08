import React from 'react'
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import TipChart from './TipChart'
import FarcasterFrame from './FarcasterFrame'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Tips Sent',
      value: '$8,234',
      change: '+12%',
      icon: Zap,
      trend: 'up'
    },
    {
      title: 'Tips Received',
      value: '$3,456',
      change: '+8%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Active Creators',
      value: '1,234',
      change: '+5%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Growth Rate',
      value: '23%',
      change: '+3%',
      icon: TrendingUp,
      trend: 'up'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Tip creators instantly
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          A Solana miniapp that allows you to easily micro-tip creators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium transition-all duration-200">
            Connect Wallet
          </button>
          <button className="glass text-white px-6 py-3 rounded-md font-medium hover:bg-white/20 transition-all duration-200">
            Send Tip
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Farcaster Frame Demo */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Farcaster Frame Integration</h2>
        <FarcasterFrame 
          frameData={{
            id: 'demo-post-1',
            creator: {
              username: '@tiplike_demo',
              address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
              avatar: '🎨'
            },
            content: 'Check out this amazing Solana-powered tipping system! Like this post to send a micro-tip directly to the creator.',
            image: 'https://via.placeholder.com/600x300/667eea/ffffff?text=Tip.Like+Demo',
            timestamp: 'Just now',
            url: window.location.href
          }}
          onAction={(action) => {
            console.log('Frame action:', action)
            // Handle frame actions here
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <TipChart />
        </div>

        {/* Activity Section */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
