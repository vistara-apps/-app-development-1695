import React, { useState } from 'react'
import AppBar from './components/AppBar'
import Dashboard from './components/Dashboard'
import TippingInterface from './components/TippingInterface'
import CreatorProfile from './components/CreatorProfile'
import WalletProvider from './components/WalletProvider'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [walletConnected, setWalletConnected] = useState(false)

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-purple">
        <AppBar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          walletConnected={walletConnected}
          setWalletConnected={setWalletConnected}
        />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'tip' && <TippingInterface />}
          {currentView === 'profile' && <CreatorProfile />}
        </main>
      </div>
    </WalletProvider>
  )
}

export default App