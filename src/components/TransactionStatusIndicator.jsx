import React from 'react'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const TransactionStatusIndicator = ({ status }) => {
  const configs = {
    pending: {
      icon: Loader,
      text: 'Processing transaction...',
      className: 'text-blue-400 bg-blue-500/20',
      iconClassName: 'animate-spin'
    },
    success: {
      icon: CheckCircle,
      text: 'Transaction successful!',
      className: 'text-green-400 bg-green-500/20',
      iconClassName: ''
    },
    error: {
      icon: XCircle,
      text: 'Transaction failed. Please try again.',
      className: 'text-red-400 bg-red-500/20',
      iconClassName: ''
    }
  }

  const config = configs[status]
  if (!config) return null

  const Icon = config.icon

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-md ${config.className}`}>
      <Icon className={`h-4 w-4 ${config.iconClassName}`} />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  )
}

export default TransactionStatusIndicator