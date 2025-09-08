import React from 'react'
import { Heart, Home, User, Zap } from 'lucide-react'
import WalletConnectButton from './WalletConnectButton'

const AppBar = ({ currentView, setCurrentView, walletConnected, setWalletConnected }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tip', label: 'Tip', icon: Zap },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-white fill-current" />
          <h1 className="text-xl font-bold text-white">Tip.Like</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <WalletConnectButton 
          connected={walletConnected}
          setConnected={setWalletConnected}
        />

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-md ${
                    currentView === item.id
                      ? 'text-white'
                      : 'text-white/70'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default AppBar