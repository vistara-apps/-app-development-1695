import React, { createContext, useContext, useState } from 'react'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [balance, setBalance] = useState(0)

  const connect = async () => {
    // Simulate wallet connection
    setTimeout(() => {
      setConnected(true)
      setPublicKey('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM')
      setBalance(2.45)
    }, 1000)
  }

  const disconnect = () => {
    setConnected(false)
    setPublicKey(null)
    setBalance(0)
  }

  const sendTransaction = async (amount, recipient) => {
    // Simulate transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        setBalance(prev => prev - amount)
        resolve({
          signature: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW'
        })
      }, 2000)
    })
  }

  return (
    <WalletContext.Provider value={{
      connected,
      publicKey,
      balance,
      connect,
      disconnect,
      sendTransaction
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider