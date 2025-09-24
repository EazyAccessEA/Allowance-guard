/**
 * AllowanceGuard SDK for Node.js
 * 
 * A comprehensive SDK for integrating with the AllowanceGuard API
 * in Node.js applications and backend services.
 * 
 * @version 1.0.0
 * @author AllowanceGuard Team
 * @license GPL-3.0
 */

const axios = require('axios')

class AllowanceGuardSDK {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'https://www.allowanceguard.com/api'
    this.apiKey = options.apiKey || null
    this.timeout = options.timeout || 30000
    this.retryAttempts = options.retryAttempts || 3
    this.retryDelay = options.retryDelay || 1000
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AllowanceGuard-SDK/1.0.0'
      }
    })

    // Add API key to headers if provided
    if (this.apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.apiKey}`
    }

    // Add request interceptor for retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config
        
        if (!config || !config.retry) {
          return Promise.reject(error)
        }

        config.retryCount = config.retryCount || 0

        if (config.retryCount >= this.retryAttempts) {
          return Promise.reject(error)
        }

        config.retryCount += 1

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * config.retryCount))

        return this.client(config)
      }
    )
  }

  /**
   * Get token allowances for a wallet address
   * @param {string} walletAddress - The wallet address to query
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Allowances data
   */
  async getAllowances(walletAddress, options = {}) {
    this.validateWalletAddress(walletAddress)
    
    const params = {
      wallet: walletAddress,
      page: options.page || 1,
      pageSize: options.pageSize || 25,
      riskOnly: options.riskOnly || false,
      chainId: options.chainId || null,
      ...options
    }

    // Remove null/undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    try {
      const response = await this.client.get('/allowances', {
        params,
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch allowances: ${error.message}`)
    }
  }

  /**
   * Get risk assessment for a specific token approval
   * @param {string} walletAddress - The wallet address
   * @param {string} tokenAddress - The token contract address
   * @param {string} spenderAddress - The spender contract address
   * @param {number} chainId - The blockchain chain ID
   * @returns {Promise<Object>} Risk assessment data
   */
  async assessRisk(walletAddress, tokenAddress, spenderAddress, chainId = 1) {
    this.validateWalletAddress(walletAddress)
    this.validateAddress(tokenAddress, 'tokenAddress')
    this.validateAddress(spenderAddress, 'spenderAddress')

    const data = {
      walletAddress,
      tokenAddress,
      spenderAddress,
      chainId
    }

    try {
      const response = await this.client.post('/risk/assess', data, {
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to assess risk: ${error.message}`)
    }
  }

  /**
   * Get supported networks and roadmap
   * @returns {Promise<Object>} Networks data
   */
  async getNetworks() {
    try {
      const response = await this.client.get('/networks/roadmap', {
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch networks: ${error.message}`)
    }
  }

  /**
   * Get chain information
   * @returns {Promise<Object>} Chain information
   */
  async getChains() {
    try {
      const response = await this.client.get('/chains', {
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch chains: ${error.message}`)
    }
  }

  /**
   * Scan a wallet for allowances (triggers background scan)
   * @param {string} walletAddress - The wallet address to scan
   * @param {Array} chains - Array of chain IDs to scan
   * @returns {Promise<Object>} Scan job information
   */
  async scanWallet(walletAddress, chains = [1, 42161, 8453]) {
    this.validateWalletAddress(walletAddress)

    const data = {
      walletAddress,
      chains
    }

    try {
      const response = await this.client.post('/scan', data, {
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to initiate wallet scan: ${error.message}`)
    }
  }

  /**
   * Get scan job status
   * @param {string} jobId - The scan job ID
   * @returns {Promise<Object>} Job status information
   */
  async getScanStatus(jobId) {
    if (!jobId) {
      throw new Error('Job ID is required')
    }

    try {
      const response = await this.client.get(`/jobs/${jobId}`, {
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch scan status: ${error.message}`)
    }
  }

  /**
   * Export allowances data
   * @param {string} walletAddress - The wallet address
   * @param {string} format - Export format ('csv' or 'pdf')
   * @param {Object} options - Export options
   * @returns {Promise<Buffer>} Exported data
   */
  async exportAllowances(walletAddress, format = 'csv', options = {}) {
    this.validateWalletAddress(walletAddress)
    
    if (!['csv', 'pdf'].includes(format)) {
      throw new Error('Format must be either "csv" or "pdf"')
    }

    const params = {
      wallet: walletAddress,
      ...options
    }

    try {
      const response = await this.client.get(`/export/${format}`, {
        params,
        responseType: 'arraybuffer',
        retry: true
      })
      return Buffer.from(response.data)
    } catch (error) {
      throw new Error(`Failed to export allowances: ${error.message}`)
    }
  }

  /**
   * Get health status of the API
   * @returns {Promise<Object>} Health status
   */
  async getHealth() {
    try {
      const response = await this.client.get('/healthz', {
        retry: true
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch health status: ${error.message}`)
    }
  }

  /**
   * Validate wallet address format
   * @private
   */
  validateWalletAddress(address) {
    if (!address) {
      throw new Error('Wallet address is required')
    }
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid wallet address format')
    }
  }

  /**
   * Validate Ethereum address format
   * @private
   */
  validateAddress(address, fieldName) {
    if (!address) {
      throw new Error(`${fieldName} is required`)
    }
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid ${fieldName} format`)
    }
  }

  /**
   * Check if address is valid Ethereum address
   * @private
   */
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  /**
   * Format allowance amount for display
   * @param {string} allowance - The allowance amount
   * @param {number} decimals - Token decimals
   * @returns {string} Formatted amount
   */
  formatAllowance(allowance, decimals = 18) {
    try {
      const num = parseFloat(allowance)
      if (isNaN(num)) return '0'
      
      if (num === 0) return '0'
      if (num === Number.MAX_SAFE_INTEGER || allowance === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
        return 'Unlimited'
      }
      
      // Format large numbers
      if (num >= Math.pow(10, decimals)) {
        return (num / Math.pow(10, decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' tokens'
      }
      
      return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
    } catch {
      return allowance
    }
  }

  /**
   * Get risk level description
   * @param {number} riskLevel - The risk level (1-4)
   * @returns {Object} Risk level information
   */
  getRiskLevelInfo(riskLevel) {
    const riskLevels = {
      1: {
        label: 'Low Risk',
        color: 'green',
        description: 'Safe approval with minimal risk'
      },
      2: {
        label: 'Medium Risk',
        color: 'yellow',
        description: 'Moderate risk, review carefully'
      },
      3: {
        label: 'High Risk',
        color: 'orange',
        description: 'High risk, consider revoking'
      },
      4: {
        label: 'Critical Risk',
        color: 'red',
        description: 'Critical risk, immediate action recommended'
      }
    }

    return riskLevels[riskLevel] || {
      label: 'Unknown Risk',
      color: 'gray',
      description: 'Risk level could not be determined'
    }
  }
}

// Export the SDK class
module.exports = AllowanceGuardSDK

// Also export as default for ES6 imports
module.exports.default = AllowanceGuardSDK
