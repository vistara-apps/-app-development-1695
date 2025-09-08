import React from 'react'

const TipAmountSelector = ({ selectedAmount, onAmountChange }) => {
  const presetAmounts = [0.01, 0.05, 0.1, 0.25, 0.5, 1.0]

  return (
    <div className="space-y-3">
      {/* Preset Amounts */}
      <div className="grid grid-cols-3 gap-2">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountChange(amount)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedAmount === amount
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {amount} SOL
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div>
        <input
          type="number"
          step="0.01"
          min="0.001"
          placeholder="Custom amount"
          value={selectedAmount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  )
}

export default TipAmountSelector