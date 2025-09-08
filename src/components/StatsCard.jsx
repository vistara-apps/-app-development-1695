import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up'

  return (
    <div className="glass rounded-lg p-4 md:p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-white/10 rounded-md">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white/70 text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl md:text-3xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default StatsCard