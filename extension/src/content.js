/**
 * AllowanceGuard Browser Extension - Content Script
 * 
 * This script runs on all web pages and:
 * 1. Monitors for wallet connection events
 * 2. Intercepts token approval transactions
 * 3. Fetches risk assessment from AllowanceGuard API
 * 4. Injects warning UI when risky approvals are detected
 */

class AllowanceGuardExtension {
  constructor() {
    this.isEnabled = true;
    this.currentWallet = null;
    this.riskCache = new Map();
    this.warningUI = null;
    this.init();
  }

  init() {
    console.log('🛡️ AllowanceGuard Extension: Content script loaded');
    
    // Listen for wallet connection events
    this.setupWalletListeners();
    
    // Monitor for transaction requests
    this.setupTransactionListeners();
    
    // Inject warning UI styles
    this.injectStyles();
  }

  setupWalletListeners() {
    // Listen for wallet connection events from various wallet providers
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      
      const { type, data } = event.data;
      
      if (type === 'WALLET_CONNECTED') {
        this.currentWallet = data.address;
        console.log('🔗 Wallet connected:', this.currentWallet);
      } else if (type === 'WALLET_DISCONNECTED') {
        this.currentWallet = null;
        console.log('🔌 Wallet disconnected');
      }
    });

    // Also listen for MetaMask events
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          this.currentWallet = accounts[0];
          console.log('🔗 MetaMask wallet connected:', this.currentWallet);
        } else {
          this.currentWallet = null;
          console.log('🔌 MetaMask wallet disconnected');
        }
      });
    }
  }

  setupTransactionListeners() {
    // Monitor for transaction requests
    const originalSend = window.ethereum?.request;
    if (originalSend) {
      window.ethereum.request = async (args) => {
        const result = await originalSend.call(window.ethereum, args);
        
        // Check if this is a transaction request
        if (args.method === 'eth_sendTransaction' || args.method === 'eth_signTransaction') {
          await this.analyzeTransaction(args.params?.[0], result);
        }
        
        return result;
      };
    }

    // Also monitor for direct transaction calls
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target && this.isTransactionButton(target)) {
        this.monitorTransactionButton(target);
      }
    });
  }

  isTransactionButton(element) {
    const text = element.textContent?.toLowerCase() || '';
    const classes = element.className?.toLowerCase() || '';
    
    return (
      text.includes('approve') ||
      text.includes('allow') ||
      text.includes('confirm') ||
      classes.includes('approve') ||
      classes.includes('confirm') ||
      element.getAttribute('data-action')?.includes('approve')
    );
  }

  monitorTransactionButton(button) {
    // Add a small delay to catch the transaction after it's initiated
    setTimeout(() => {
      this.checkForPendingTransactions();
    }, 1000);
  }

  async checkForPendingTransactions() {
    if (!this.currentWallet) return;

    try {
      // Check if there are pending transactions in the wallet
      const pendingTxs = await this.getPendingTransactions();
      
      for (const tx of pendingTxs) {
        await this.analyzeTransaction(tx);
      }
    } catch (error) {
      console.error('Error checking pending transactions:', error);
    }
  }

  async getPendingTransactions() {
    // This is a simplified version - in reality, you'd need to
    // monitor the wallet's transaction queue or use wallet-specific APIs
    return [];
  }

  async analyzeTransaction(transaction, result = null) {
    if (!this.currentWallet || !transaction) return;

    try {
      // Check if this is a token approval transaction
      const isApproval = this.isTokenApproval(transaction);
      if (!isApproval) return;

      console.log('🔍 Analyzing token approval transaction:', transaction);

      // Get risk assessment from AllowanceGuard API
      const riskData = await this.getRiskAssessment(transaction);
      
      if (riskData && riskData.riskLevel > 0) {
        this.showWarning(riskData, transaction);
      }
    } catch (error) {
      console.error('Error analyzing transaction:', error);
    }
  }

  isTokenApproval(transaction) {
    // Check if transaction is calling approve() or setApprovalForAll()
    const data = transaction.data || '';
    
    // ERC-20 approve function signature: 0x095ea7b3
    // ERC-721 setApprovalForAll function signature: 0xa22cb465
    return data.startsWith('0x095ea7b3') || data.startsWith('0xa22cb465');
  }

  async getRiskAssessment(transaction) {
    const cacheKey = `${transaction.to}_${transaction.data}`;
    
    // Check cache first
    if (this.riskCache.has(cacheKey)) {
      return this.riskCache.get(cacheKey);
    }

    try {
      const response = await fetch('https://www.allowanceguard.com/api/risk/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: this.currentWallet,
          tokenAddress: transaction.to,
          spenderAddress: this.extractSpenderAddress(transaction.data),
          chainId: await this.getCurrentChainId()
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const riskData = await response.json();
      
      // Cache the result
      this.riskCache.set(cacheKey, riskData);
      
      return riskData;
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
      return null;
    }
  }

  extractSpenderAddress(data) {
    // Extract spender address from transaction data
    // For approve(address,uint256): spender is the first parameter (32 bytes after function selector)
    if (data.startsWith('0x095ea7b3')) {
      return '0x' + data.slice(34, 74); // Skip function selector and padding
    }
    return null;
  }

  async getCurrentChainId() {
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return parseInt(chainId, 16);
      }
    } catch (error) {
      console.error('Error getting chain ID:', error);
    }
    return 1; // Default to Ethereum mainnet
  }

  showWarning(riskData, transaction) {
    console.log('⚠️ High risk transaction detected:', riskData);
    
    // Remove existing warning if any
    this.hideWarning();
    
    // Create and inject warning UI
    this.warningUI = this.createWarningUI(riskData, transaction);
    document.body.appendChild(this.warningUI);
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
      this.hideWarning();
    }, 30000);
  }

  createWarningUI(riskData, transaction) {
    const warning = document.createElement('div');
    warning.id = 'allowance-guard-warning';
    warning.innerHTML = `
      <div class="ag-warning-overlay">
        <div class="ag-warning-modal">
          <div class="ag-warning-header">
            <div class="ag-warning-icon">⚠️</div>
            <h3>High Risk Token Approval Detected</h3>
            <button class="ag-warning-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
          </div>
          <div class="ag-warning-content">
            <p><strong>Risk Level:</strong> ${this.getRiskLevelText(riskData.riskLevel)}</p>
            <p><strong>Token:</strong> ${riskData.tokenName || 'Unknown'}</p>
            <p><strong>Spender:</strong> ${riskData.spenderName || 'Unknown Contract'}</p>
            <p><strong>Issues Found:</strong></p>
            <ul>
              ${riskData.issues?.map(issue => `<li>${issue}</li>`).join('') || '<li>Multiple risk factors detected</li>'}
            </ul>
          </div>
          <div class="ag-warning-actions">
            <button class="ag-warning-btn ag-warning-btn-primary" onclick="window.open('https://www.allowanceguard.com', '_blank')">
              View in AllowanceGuard
            </button>
            <button class="ag-warning-btn ag-warning-btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    `;
    
    return warning;
  }

  getRiskLevelText(level) {
    switch (level) {
      case 1: return 'Low Risk';
      case 2: return 'Medium Risk';
      case 3: return 'High Risk';
      case 4: return 'Critical Risk';
      default: return 'Unknown Risk';
    }
  }

  hideWarning() {
    if (this.warningUI) {
      this.warningUI.remove();
      this.warningUI = null;
    }
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #allowance-guard-warning {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .ag-warning-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      
      .ag-warning-modal {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .ag-warning-header {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e5e5e5;
        position: relative;
      }
      
      .ag-warning-icon {
        font-size: 24px;
        margin-right: 12px;
      }
      
      .ag-warning-header h3 {
        margin: 0;
        color: #d32f2f;
        font-size: 18px;
        font-weight: 600;
      }
      
      .ag-warning-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .ag-warning-close:hover {
        color: #333;
      }
      
      .ag-warning-content {
        padding: 20px;
      }
      
      .ag-warning-content p {
        margin: 0 0 12px 0;
        color: #333;
        line-height: 1.5;
      }
      
      .ag-warning-content ul {
        margin: 8px 0 0 0;
        padding-left: 20px;
      }
      
      .ag-warning-content li {
        margin: 4px 0;
        color: #666;
      }
      
      .ag-warning-actions {
        padding: 20px;
        border-top: 1px solid #e5e5e5;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      
      .ag-warning-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .ag-warning-btn-primary {
        background: #d32f2f;
        color: white;
      }
      
      .ag-warning-btn-primary:hover {
        background: #b71c1c;
      }
      
      .ag-warning-btn-secondary {
        background: #f5f5f5;
        color: #333;
      }
      
      .ag-warning-btn-secondary:hover {
        background: #e0e0e0;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize the extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AllowanceGuardExtension();
  });
} else {
  new AllowanceGuardExtension();
}
