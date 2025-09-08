import React from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWalletIntegration } from '../hooks/useWalletIntegration'

const WalletConnectButton = ({ variant = 'primary' }) => {
  const { connected, balance, disconnect, formatPublicKey, loading } = useWalletIntegration()
  const { setVisible } = useWalletModal()

  const handleConnect = () => {
    setVisible(true)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (connected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-white text-sm font-medium">
            {balance.toFixed(2)} SOL
          </span>
          <span className="text-white/70 text-xs">
            {formatPublicKey()}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-all duration-200"
          title="Disconnect Wallet"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connected</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className={`
        flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 px-4 py-2 rounded-md font-medium
        ${variant === 'primary' 
          ? 'bg-accent hover:bg-accent/90 text-white' 
          : 'bg-white/20 hover:bg-white/30 text-white'
        }
      `}
    >
      <Wallet className="h-4 w-4" />
      <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  )
}

export default WalletConnectButton
