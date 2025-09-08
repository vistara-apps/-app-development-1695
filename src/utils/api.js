// API utilities for Tip.Like backend integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // User management
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUser(farcasterId) {
    return this.request(`/users/${farcasterId}`)
  }

  async updateUser(farcasterId, userData) {
    return this.request(`/users/${farcasterId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Creator management
  async createCreator(creatorData) {
    return this.request('/creators', {
      method: 'POST',
      body: JSON.stringify(creatorData),
    })
  }

  async getCreator(farcasterId) {
    return this.request(`/creators/${farcasterId}`)
  }

  async updateCreator(farcasterId, creatorData) {
    return this.request(`/creators/${farcasterId}`, {
      method: 'PUT',
      body: JSON.stringify(creatorData),
    })
  }

  // Tip transactions
  async createTip(tipData) {
    return this.request('/tips', {
      method: 'POST',
      body: JSON.stringify(tipData),
    })
  }

  async getTips(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/tips${queryString ? `?${queryString}` : ''}`)
  }

  async getTipsByUser(farcasterId, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/tips/user/${farcasterId}${queryString ? `?${queryString}` : ''}`)
  }

  async getTipsByCreator(farcasterId, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/tips/creator/${farcasterId}${queryString ? `?${queryString}` : ''}`)
  }

  // Analytics
  async getAnalytics(farcasterId, timeframe = '7d') {
    return this.request(`/analytics/${farcasterId}?timeframe=${timeframe}`)
  }

  async getGlobalStats() {
    return this.request('/analytics/global')
  }

  // Farcaster Frame API
  async getFrameMetadata(postId) {
    return this.request(`/frame/${postId}/metadata`)
  }

  async handleFrameAction(actionData) {
    return this.request('/frame/action', {
      method: 'POST',
      body: JSON.stringify(actionData),
    })
  }

  // Transaction verification
  async verifyTransaction(signature, expectedData) {
    return this.request('/transactions/verify', {
      method: 'POST',
      body: JSON.stringify({ signature, expectedData }),
    })
  }

  // Batch operations
  async batchTips(tips) {
    return this.request('/tips/batch', {
      method: 'POST',
      body: JSON.stringify({ tips }),
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Convenience functions
export const userApi = {
  create: (userData) => apiClient.createUser(userData),
  get: (farcasterId) => apiClient.getUser(farcasterId),
  update: (farcasterId, userData) => apiClient.updateUser(farcasterId, userData),
}

export const creatorApi = {
  create: (creatorData) => apiClient.createCreator(creatorData),
  get: (farcasterId) => apiClient.getCreator(farcasterId),
  update: (farcasterId, creatorData) => apiClient.updateCreator(farcasterId, creatorData),
}

export const tipApi = {
  create: (tipData) => apiClient.createTip(tipData),
  getAll: (params) => apiClient.getTips(params),
  getByUser: (farcasterId, params) => apiClient.getTipsByUser(farcasterId, params),
  getByCreator: (farcasterId, params) => apiClient.getTipsByCreator(farcasterId, params),
  batch: (tips) => apiClient.batchTips(tips),
}

export const analyticsApi = {
  get: (farcasterId, timeframe) => apiClient.getAnalytics(farcasterId, timeframe),
  global: () => apiClient.getGlobalStats(),
}

export const frameApi = {
  getMetadata: (postId) => apiClient.getFrameMetadata(postId),
  handleAction: (actionData) => apiClient.handleFrameAction(actionData),
}

export const transactionApi = {
  verify: (signature, expectedData) => apiClient.verifyTransaction(signature, expectedData),
}

export default apiClient
