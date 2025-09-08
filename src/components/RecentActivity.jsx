import React from 'react'
import { ExternalLink, Heart, Zap } from 'lucide-react'

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'tip_sent',
      user: '@alice.eth',
      amount: '0.1 SOL',
      time: '2 min ago',
      content: 'Amazing artwork!'
    },
    {
      id: 2,
      type: 'tip_received',
      user: '@bob.sol',
      amount: '0.05 SOL',
      time: '5 min ago',
      content: 'Great tutorial series'
    },
    {
      id: 3,
      type: 'tip_sent',
      user: '@charlie.nft',
      amount: '0.2 SOL',
      time: '10 min ago',
      content: 'Love this content!'
    },
    {
      id: 4,
      type: 'tip_received',
      user: '@diana.crypto',
      amount: '0.15 SOL',
      time: '15 min ago',
      content: 'Helpful insights'
    }
  ]

  return (
    <div className="glass rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
        <button className="text-white/70 hover:text-white text-sm flex items-center space-x-1">
          <span>View all</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-white/5 rounded-md transition-all duration-200">
            <div className={`p-2 rounded-full ${
              activity.type === 'tip_sent' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {activity.type === 'tip_sent' ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-medium truncate">
                  {activity.type === 'tip_sent' ? 'Tipped' : 'Received from'} {activity.user}
                </p>
                <span className="text-white/70 text-xs whitespace-nowrap ml-2">
                  {activity.time}
                </span>
              </div>
              
              <p className="text-white/70 text-sm truncate mt-1">
                {activity.content}
              </p>
              
              <p className="text-accent text-sm font-medium mt-1">
                {activity.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200">
        Load more activity
      </button>
    </div>
  )
}

export default RecentActivity