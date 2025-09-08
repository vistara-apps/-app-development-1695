import React from 'react'

const TipChart = () => {
  // Mock chart data
  const chartData = [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 190 },
    { day: 'Wed', amount: 80 },
    { day: 'Thu', amount: 210 },
    { day: 'Fri', amount: 150 },
    { day: 'Sat', amount: 180 },
    { day: 'Sun', amount: 220 },
  ]

  const maxAmount = Math.max(...chartData.map(d => d.amount))

  return (
    <div className="glass rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Tipping Activity</h3>
        <select className="bg-white/10 text-white border border-white/20 rounded-md px-3 py-1 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="space-y-4">
        {/* Chart */}
        <div className="flex items-end justify-between h-32 md:h-40 space-x-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-accent to-accent/60 rounded-t-sm transition-all duration-300 hover:from-accent/80 hover:to-accent/40"
                style={{ 
                  height: `${(data.amount / maxAmount) * 100}%`,
                  minHeight: '4px'
                }}
              />
              <span className="text-white/70 text-xs mt-2">{data.day}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <p className="text-white/70 text-sm">Total this week</p>
            <p className="text-white text-xl font-semibold">$1,150</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Average per day</p>
            <p className="text-white text-xl font-semibold">$164</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TipChart