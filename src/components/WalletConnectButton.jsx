import React, { useState } from 'react'
import { Wallet, ChevronDown } from 'lucide-react'
import { useWallet } from './WalletProvider'

const WalletConnectButton = () => {
  const { connected, publicKey, balance, connect, disconnect } = useWallet()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect()
    } finally {
      setIsLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-white text-sm font-medium">
            {balance.toFixed(2)} SOL
          </span>
          <span className="text-white/70 text-xs">
            {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-all duration-200"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connected</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50"
    >
      <Wallet className="h-4 w-4" />
      <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  )
}

export default WalletConnectButton