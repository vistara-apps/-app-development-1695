// Comprehensive error handling for Tip.Like

export class TipLikeError extends Error {
  constructor(message, code, details = {}) {
    super(message)
    this.name = 'TipLikeError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Error codes
export const ERROR_CODES = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED: 'WALLET_CONNECTION_FAILED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  
  // Transaction errors
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  
  // API errors
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  
  // Frame errors
  FRAME_ERROR: 'FRAME_ERROR',
  INVALID_FRAME_DATA: 'INVALID_FRAME_DATA',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
}

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.WALLET_NOT_CONNECTED]: 'Please connect your wallet to continue',
  [ERROR_CODES.WALLET_CONNECTION_FAILED]: 'Failed to connect wallet. Please try again',
  [ERROR_CODES.INSUFFICIENT_BALANCE]: 'Insufficient balance to complete this transaction',
  [ERROR_CODES.INVALID_ADDRESS]: 'Invalid wallet address provided',
  [ERROR_CODES.TRANSACTION_FAILED]: 'Transaction failed. Please try again',
  [ERROR_CODES.TRANSACTION_TIMEOUT]: 'Transaction timed out. Please check your wallet',
  [ERROR_CODES.INVALID_AMOUNT]: 'Invalid tip amount. Must be greater than 0',
  [ERROR_CODES.API_ERROR]: 'Server error. Please try again later',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection',
  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized access',
  [ERROR_CODES.NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.FRAME_ERROR]: 'Frame processing error',
  [ERROR_CODES.INVALID_FRAME_DATA]: 'Invalid frame data received',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation failed'
}

// Error handler class
export class ErrorHandler {
  constructor() {
    this.listeners = []
  }

  // Add error listener
  addListener(callback) {
    this.listeners.push(callback)
  }

  // Remove error listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }

  // Handle error
  handle(error, context = {}) {
    const processedError = this.processError(error, context)
    
    // Log error
    this.logError(processedError, context)
    
    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(processedError, context)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })

    return processedError
  }

  // Process and normalize error
  processError(error, context = {}) {
    if (error instanceof TipLikeError) {
      return error
    }

    // Handle Solana wallet errors
    if (error.message?.includes('User rejected')) {
      return new TipLikeError(
        'Transaction was cancelled by user',
        ERROR_CODES.TRANSACTION_FAILED,
        { originalError: error.message, context }
      )
    }

    if (error.message?.includes('Insufficient funds')) {
      return new TipLikeError(
        ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_BALANCE],
        ERROR_CODES.INSUFFICIENT_BALANCE,
        { originalError: error.message, context }
      )
    }

    // Handle network errors
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      return new TipLikeError(
        ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
        ERROR_CODES.NETWORK_ERROR,
        { originalError: error.message, context }
      )
    }

    // Handle API errors
    if (error.status) {
      const code = error.status === 401 ? ERROR_CODES.UNAUTHORIZED :
                   error.status === 404 ? ERROR_CODES.NOT_FOUND :
                   ERROR_CODES.API_ERROR
      
      return new TipLikeError(
        ERROR_MESSAGES[code],
        code,
        { status: error.status, originalError: error.message, context }
      )
    }

    // Default error
    return new TipLikeError(
      error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
      ERROR_CODES.UNKNOWN_ERROR,
      { originalError: error.message, context }
    )
  }

  // Log error
  logError(error, context = {}) {
    const logData = {
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
      context,
      stack: error.stack
    }

    // Log to console in development
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('TipLike Error:', logData)
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      // Integration with Sentry or other monitoring service
      this.sendToMonitoring(logData)
    }
  }

  // Send error to monitoring service
  sendToMonitoring(errorData) {
    // Placeholder for monitoring service integration
    // This would typically send to Sentry, LogRocket, etc.
    try {
      // Example: Sentry.captureException(errorData)
      console.log('Would send to monitoring:', errorData)
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError)
    }
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Convenience functions
export const handleError = (error, context) => errorHandler.handle(error, context)

export const createError = (message, code, details) => new TipLikeError(message, code, details)

// React hook for error handling (import React in component that uses this)
export const useErrorHandler = () => {
  // Note: Import React and use React hooks in the component that uses this
  // This is a factory function that returns the hook implementation
  return (React) => {
    const [error, setError] = React.useState(null)

    const handleError = React.useCallback((error, context = {}) => {
      const processedError = errorHandler.handle(error, context)
      setError(processedError)
      return processedError
    }, [])

    const clearError = React.useCallback(() => {
      setError(null)
    }, [])

    return {
      error,
      handleError,
      clearError
    }
  }
}

// Error boundary component (import React in component that uses this)
export const createErrorBoundary = (React) => {
  return class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    errorHandler.handle(error, { errorInfo, boundary: true })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gradient-purple flex items-center justify-center p-4">
          <div className="glass rounded-lg p-8 max-w-md w-full text-center">
            <h2 className="text-white text-xl font-semibold mb-4">
              Something went wrong
            </h2>
            <p className="text-white/80 mb-6">
              We're sorry, but something unexpected happened. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md font-medium transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default errorHandler
