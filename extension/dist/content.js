/**
 * AllowanceGuard Browser Extension - Content Script
 *
 * Intercepts wallet transactions BEFORE signing:
 * 1. Detects approve(), permit(), permit2(), and setApprovalForAll() calls
 * 2. Fetches risk assessment from AllowanceGuard API
 * 3. Shows risk popup with spender history, verification status, scam patterns
 * 4. Allows user to modify approval amount (unlimited -> exact)
 * 5. Links to full AllowanceGuard dashboard
 * 6. Pro/Sentinel users get enhanced analysis
 */

// Defence against XSS in the warning overlay. The dynamic values
// rendered via innerHTML come from our own API (token_name, spender
// label, issue descriptions) but a future DB poisoning or a compromised
// upstream metadata feed must not become a scripted injection on every
// user's page. Firefox's addons-linter also fails v2.0.0's
// UNSAFE_VAR_ASSIGNMENT check without this escape.
function escapeHtml(value) {
  if (value == null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

class AllowanceGuardExtension {
  constructor() {
    this.isEnabled = true;
    this.currentWallet = null;
    this.riskCache = new Map();
    this.warningUI = null;
    this.apiEndpoint = 'https://www.allowanceguard.com';
    this.userTier = 'free'; // free | pro | sentinel
    this.init();
  }

  init() {
    console.log('[AllowanceGuard] Content script loaded');

    this.loadSettings();
    this.injectStyles();
    this.interceptProviderRequests();
    this.setupWalletListeners();

    // Listen for messages from background / popup
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'EXTENSION_TOGGLED') this.isEnabled = msg.enabled;
      if (msg.type === 'SETTINGS_UPDATED') this.loadSettings();
    });
  }

  async loadSettings() {
    try {
      const settings = await new Promise((resolve) =>
        chrome.storage.sync.get(
          { enabled: true, apiEndpoint: 'https://www.allowanceguard.com', userTier: 'free' },
          resolve,
        ),
      );
      this.isEnabled = settings.enabled;
      this.apiEndpoint = settings.apiEndpoint;
      this.userTier = settings.userTier;
    } catch {
      // Defaults are fine
    }
  }

  // -----------------------------------------------------------------------
  // Provider interception — the core of pre-signing protection
  // -----------------------------------------------------------------------

  interceptProviderRequests() {
    // Inject a script into the page to intercept ethereum.request
    // (content scripts share DOM but not JS context with the page)
    const script = document.createElement('script');
    script.textContent = `(${this._injectedInterceptor.toString()})()`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    // Listen for intercepted transactions from the injected script
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      if (event.data?.type === 'AG_TX_INTERCEPT') {
        this.handleInterceptedTransaction(event.data.payload);
      }
      if (event.data?.type === 'AG_SIGN_INTERCEPT') {
        this.handleInterceptedSignature(event.data.payload);
      }
    });
  }

  /** Injected into the PAGE context to wrap ethereum.request */
  _injectedInterceptor() {
    const APPROVE_SIG = '0x095ea7b3';
    const SET_APPROVAL_FOR_ALL_SIG = '0xa22cb465';
    const PERMIT2_APPROVE_SIG = '0x87517c45'; // approve(address,address,uint160,uint48)

    if (!window.ethereum) return;

    const originalRequest = window.ethereum.request.bind(window.ethereum);

    window.ethereum.request = async function (args) {
      // Intercept eth_sendTransaction
      if (args.method === 'eth_sendTransaction' && args.params?.[0]) {
        const tx = args.params[0];
        const data = tx.data || '';

        if (
          data.startsWith(APPROVE_SIG) ||
          data.startsWith(SET_APPROVAL_FOR_ALL_SIG) ||
          data.startsWith(PERMIT2_APPROVE_SIG)
        ) {
          const fnSig = data.startsWith(APPROVE_SIG)
            ? 'approve'
            : data.startsWith(SET_APPROVAL_FOR_ALL_SIG)
              ? 'setApprovalForAll'
              : 'permit2';

          window.postMessage(
            {
              type: 'AG_TX_INTERCEPT',
              payload: {
                to: tx.to,
                data,
                from: tx.from,
                functionSignature: fnSig,
              },
            },
            '*',
          );
        }
      }

      // Intercept eth_signTypedData_v4 (EIP-2612 permit / Permit2)
      if (
        (args.method === 'eth_signTypedData_v4' || args.method === 'eth_signTypedData_v3') &&
        args.params?.[1]
      ) {
        try {
          const typed = typeof args.params[1] === 'string' ? JSON.parse(args.params[1]) : args.params[1];
          const primaryType = typed.primaryType || '';
          if (
            primaryType === 'Permit' ||
            primaryType === 'PermitSingle' ||
            primaryType === 'PermitBatch'
          ) {
            window.postMessage(
              {
                type: 'AG_SIGN_INTERCEPT',
                payload: {
                  from: args.params[0],
                  typedData: typed,
                  primaryType,
                },
              },
              '*',
            );
          }
        } catch {
          // ignore parse errors
        }
      }

      return originalRequest(args);
    };
  }

  // -----------------------------------------------------------------------
  // Transaction analysis
  // -----------------------------------------------------------------------

  async handleInterceptedTransaction(payload) {
    if (!this.isEnabled) return;

    const { to, data, from, functionSignature } = payload;
    const spender = this.extractSpenderAddress(data, functionSignature);
    const amount = this.extractAmount(data, functionSignature);
    const chainId = await this.getCurrentChainId();

    const riskData = await this.fetchRiskAssessment({
      walletAddress: from || this.currentWallet,
      tokenAddress: to,
      spenderAddress: spender,
      chainId,
      amount,
      functionSignature,
    });

    if (riskData && riskData.riskLevel >= 1) {
      this.showWarning(riskData, {
        tokenAddress: to,
        spenderAddress: spender,
        amount,
        functionSignature,
        chainId,
      });
    }
  }

  async handleInterceptedSignature(payload) {
    if (!this.isEnabled) return;

    const { from, typedData, primaryType } = payload;
    const chainId = await this.getCurrentChainId();

    let tokenAddress = '';
    let spenderAddress = '';
    let amount = '';

    if (primaryType === 'Permit' && typedData.message) {
      // EIP-2612 Permit
      tokenAddress = typedData.domain?.verifyingContract || '';
      spenderAddress = typedData.message.spender || '';
      amount = typedData.message.value || '';
    } else if (primaryType === 'PermitSingle' && typedData.message) {
      // Permit2 PermitSingle
      tokenAddress = typedData.message.details?.token || '';
      spenderAddress = typedData.message.spender || '';
      amount = typedData.message.details?.amount || '';
    } else if (primaryType === 'PermitBatch' && typedData.message) {
      // Permit2 PermitBatch — assess the first token for now
      const first = typedData.message.details?.[0];
      tokenAddress = first?.token || '';
      spenderAddress = typedData.message.spender || '';
      amount = first?.amount || '';
    }

    if (!tokenAddress || !spenderAddress) return;

    const fnSig = primaryType === 'Permit' ? 'permit' : 'permit2';

    const riskData = await this.fetchRiskAssessment({
      walletAddress: from || this.currentWallet,
      tokenAddress: tokenAddress.toLowerCase(),
      spenderAddress: spenderAddress.toLowerCase(),
      chainId,
      amount,
      functionSignature: fnSig,
    });

    if (riskData && riskData.riskLevel >= 1) {
      this.showWarning(riskData, {
        tokenAddress,
        spenderAddress,
        amount,
        functionSignature: fnSig,
        chainId,
      });
    }
  }

  // -----------------------------------------------------------------------
  // Calldata parsing helpers
  // -----------------------------------------------------------------------

  extractSpenderAddress(data, fnSig) {
    if (fnSig === 'approve' || fnSig === 'setApprovalForAll') {
      // First param is the spender (32 bytes padded address)
      return '0x' + data.slice(34, 74);
    }
    if (fnSig === 'permit2') {
      // approve(address token, address spender, uint160 amount, uint48 expiration)
      // spender is the second param
      return '0x' + data.slice(98, 138);
    }
    return null;
  }

  extractAmount(data, fnSig) {
    if (fnSig === 'approve') {
      // Second param is the amount (32 bytes)
      const rawAmount = data.slice(74, 138);
      if (rawAmount === 'f'.repeat(64) || rawAmount === 'f'.repeat(64).toUpperCase()) {
        return 'unlimited';
      }
      try {
        return BigInt('0x' + rawAmount).toString();
      } catch {
        return null;
      }
    }
    if (fnSig === 'setApprovalForAll') {
      return 'unlimited'; // setApprovalForAll is always full access
    }
    return null;
  }

  async getCurrentChainId() {
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return parseInt(chainId, 16);
      }
    } catch {
      // fallback
    }
    return 1;
  }

  // -----------------------------------------------------------------------
  // API call
  // -----------------------------------------------------------------------

  async fetchRiskAssessment(params) {
    const cacheKey = `${params.chainId}:${params.tokenAddress}:${params.spenderAddress}`;
    if (this.riskCache.has(cacheKey)) {
      return this.riskCache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/api/risk/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AG-Source': 'extension',
          'X-AG-Version': '2.0.0',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const riskData = await response.json();
      this.riskCache.set(cacheKey, riskData);

      // Notify background for stats tracking
      chrome.runtime.sendMessage({
        type: 'LOG_EVENT',
        data: {
          type: 'risk_assessment',
          riskLevel: riskData.riskLevel,
          tokenAddress: params.tokenAddress,
          spenderAddress: params.spenderAddress,
          chainId: params.chainId,
        },
      });

      return riskData;
    } catch (error) {
      console.error('[AllowanceGuard] Risk assessment failed:', error);
      return null;
    }
  }

  // -----------------------------------------------------------------------
  // Wallet connection tracking
  // -----------------------------------------------------------------------

  setupWalletListeners() {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      if (event.data?.type === 'WALLET_CONNECTED') {
        this.currentWallet = event.data.data?.address;
      } else if (event.data?.type === 'WALLET_DISCONNECTED') {
        this.currentWallet = null;
      }
    });

    if (window.ethereum) {
      try {
        window.ethereum.on('accountsChanged', (accounts) => {
          this.currentWallet = accounts.length > 0 ? accounts[0] : null;
        });
      } catch {
        // not all providers support .on()
      }
    }
  }

  // -----------------------------------------------------------------------
  // Warning UI
  // -----------------------------------------------------------------------

  showWarning(riskData, txInfo) {
    this.hideWarning();

    const overlay = document.createElement('div');
    overlay.id = 'allowance-guard-warning';

    const riskColor =
      riskData.riskLevel >= 4 ? '#EF4444'
        : riskData.riskLevel >= 3 ? '#F97316'
          : riskData.riskLevel >= 2 ? '#F59E0B'
            : '#22C55E';

    const riskText = riskData.riskLevelText || this.getRiskLevelText(riskData.riskLevel);

    // Overlay restructured for v2.0.3 per Mozilla Acceptable Use review:
    // only surface findings, never reassurance. An absent row means "no
    // signal," not "cleared safe." The earlier design rendered green
    // checkmarks ("No exploit match", "No scam patterns") on every
    // transaction — implying verification we had not performed. Now
    // checkmarks only appear when the backend returned a positive
    // signal about that specific field.
    //
    // Pro/Sentinel upsell removed from the warning entirely. Mixing a
    // revenue CTA into a safety screen was the other half of the
    // deception concern, and practically the detections don't differ
    // between tiers — Pro's actual delta is email alerts + batch
    // monitoring on the web dashboard, not a different risk engine.
    //
    // riskColor is produced from hex literals above — safe to interpolate
    // raw. Everything that traces back to API / wallet input goes
    // through escapeHtml() so a malicious token name or issue text
    // cannot break out of the string and execute script.
    overlay.innerHTML = `
      <div class="ag-warning-overlay">
        <div class="ag-warning-modal">
          <div class="ag-warning-header" style="border-left: 4px solid ${riskColor};">
            <div class="ag-warning-icon">${riskData.riskLevel >= 3 ? '\u26A0\uFE0F' : '\u2139\uFE0F'}</div>
            <div>
              <h3>${riskData.riskLevel >= 3 ? 'Risky Approval Detected' : 'Approval Review'}</h3>
              <span class="ag-risk-badge" style="background: ${riskColor}20; color: ${riskColor}; border: 1px solid ${riskColor}40;">
                ${escapeHtml(riskText)} Risk
              </span>
            </div>
            <button class="ag-warning-close" id="ag-close-btn">\u00D7</button>
          </div>

          <div class="ag-warning-content">
            <p class="ag-advisory">This is a warning, not a block. Your wallet remains in control — proceed or reject in your wallet as usual.</p>

            <div class="ag-info-grid">
              <div class="ag-info-row">
                <span class="ag-label">Token</span>
                <span class="ag-value">${escapeHtml(riskData.tokenName || 'Unknown')}${riskData.tokenSymbol ? ` (${escapeHtml(riskData.tokenSymbol)})` : ''}</span>
              </div>
              <div class="ag-info-row">
                <span class="ag-label">Spender</span>
                <span class="ag-value">${escapeHtml(riskData.spenderName || this.truncateAddress(txInfo.spenderAddress))}</span>
              </div>
              <div class="ag-info-row">
                <span class="ag-label">Type</span>
                <span class="ag-value">${escapeHtml(this.getFunctionLabel(txInfo.functionSignature))}</span>
              </div>
              ${riskData.spenderTrusted ? `
              <div class="ag-info-row">
                <span class="ag-label">Our spender label</span>
                <span class="ag-value ag-trusted">Listed as trusted in our curated index</span>
              </div>` : ''}
              ${riskData.issueDetails?.some(i => i.code === 'KNOWN_EXPLOIT') ? `
              <div class="ag-info-row ag-row-critical">
                <span class="ag-label">Known-exploit list</span>
                <span class="ag-value">Match found in our curated list of ~30 high-profile exploit addresses</span>
              </div>` : ''}
              ${riskData.issueDetails?.some(i => i.code === 'RISKY_HISTORY') ? `
              <div class="ag-info-row ag-row-critical">
                <span class="ag-label">Flagged across other wallets</span>
                <span class="ag-value">This spender has been risk-scored on ${Number(riskData.affectedWallets) || 'multiple'} other wallets in our database</span>
              </div>` : ''}
            </div>

            ${riskData.issues && riskData.issues.length > 0 ? `
            <div class="ag-issues">
              <h4>Signals</h4>
              <ul>
                ${riskData.issues.map(issue => `<li>${escapeHtml(issue)}</li>`).join('')}
              </ul>
            </div>` : ''}

            ${riskData.isUnlimited ? `
            <div class="ag-amount-modifier">
              <h4>Modify Approval Amount</h4>
              <p class="ag-hint">Instead of unlimited access, approve only what's needed:</p>
              <div class="ag-amount-input-wrap">
                <input type="text" id="ag-custom-amount" class="ag-amount-input" placeholder="Enter exact amount needed" />
                <button id="ag-apply-amount" class="ag-btn ag-btn-outline">Apply</button>
              </div>
              <p class="ag-hint">Note: Amount modification requires re-initiating the transaction in the dApp.</p>
            </div>` : ''}

            <p class="ag-recommendation"><strong>Recommendation:</strong> ${escapeHtml(riskData.recommendation)}</p>
            <p class="ag-disclaimer">AllowanceGuard checks patterns we know about. It cannot detect every attack vector and does not guarantee transaction safety. Always read your wallet's confirmation screen.</p>
          </div>

          <div class="ag-warning-actions">
            <button class="ag-btn ag-btn-primary" id="ag-open-dashboard">
              View Full Report
            </button>
            <button class="ag-btn ag-btn-secondary" id="ag-dismiss-btn">
              ${riskData.riskLevel >= 3 ? 'Dismiss (Proceed at Risk)' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.warningUI = overlay;

    // Wire up event handlers
    overlay.querySelector('#ag-close-btn').addEventListener('click', () => this.hideWarning());
    overlay.querySelector('#ag-dismiss-btn').addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'LOG_EVENT',
        data: { type: 'warning_dismissed', riskLevel: riskData.riskLevel },
      });
      this.hideWarning();
    });
    overlay.querySelector('#ag-open-dashboard').addEventListener('click', () => {
      window.open(riskData.dashboardUrl || `${this.apiEndpoint}/report/${txInfo.spenderAddress}`, '_blank');
    });

    const applyBtn = overlay.querySelector('#ag-apply-amount');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const input = overlay.querySelector('#ag-custom-amount');
        const customAmount = input?.value;
        if (customAmount) {
          // Store the recommended amount for the user to re-approve
          chrome.storage.local.set({
            lastRecommendedAmount: customAmount,
            lastTokenAddress: txInfo.tokenAddress,
            lastSpenderAddress: txInfo.spenderAddress,
          });
          input.style.borderColor = '#22C55E';
          applyBtn.textContent = 'Saved';
          applyBtn.disabled = true;
        }
      });
    }

    // Log warning shown
    chrome.runtime.sendMessage({
      type: 'LOG_EVENT',
      data: { type: 'warning_shown', riskLevel: riskData.riskLevel },
    });
  }

  hideWarning() {
    if (this.warningUI) {
      this.warningUI.remove();
      this.warningUI = null;
    }
  }

  truncateAddress(addr) {
    if (!addr || addr.length < 10) return addr || 'Unknown';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  getFunctionLabel(sig) {
    const labels = {
      approve: 'ERC-20 Approve',
      permit: 'EIP-2612 Permit (Gasless)',
      permit2: 'Uniswap Permit2',
      setApprovalForAll: 'Set Approval For All (NFT)',
    };
    return labels[sig] || sig || 'Unknown';
  }

  getRiskLevelText(level) {
    if (level >= 4) return 'Critical';
    if (level >= 3) return 'High';
    if (level >= 2) return 'Medium';
    if (level >= 1) return 'Low';
    return 'Safe';
  }

  // -----------------------------------------------------------------------
  // Styles
  // -----------------------------------------------------------------------

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #allowance-guard-warning {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .ag-warning-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); display: flex;
        align-items: center; justify-content: center; padding: 20px;
      }
      .ag-warning-modal {
        background: #fff; border-radius: 16px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        max-width: 480px; width: 100%; max-height: 85vh; overflow-y: auto;
      }
      .ag-warning-header {
        display: flex; align-items: center; gap: 12px;
        padding: 20px; border-bottom: 1px solid #e5e7eb; position: relative;
      }
      .ag-warning-icon { font-size: 28px; flex-shrink: 0; }
      .ag-warning-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #111; }
      .ag-risk-badge {
        display: inline-block; font-size: 11px; font-weight: 600;
        padding: 2px 8px; border-radius: 20px; margin-top: 4px;
      }
      .ag-warning-close {
        position: absolute; top: 16px; right: 16px; background: none;
        border: none; font-size: 22px; cursor: pointer; color: #9ca3af;
        width: 28px; height: 28px; display: flex; align-items: center;
        justify-content: center; border-radius: 6px;
      }
      .ag-warning-close:hover { background: #f3f4f6; color: #374151; }
      .ag-warning-content { padding: 20px; }
      .ag-info-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
      .ag-info-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 6px 0; border-bottom: 1px solid #f3f4f6;
      }
      .ag-label { font-size: 13px; color: #6b7280; }
      .ag-value { font-size: 13px; color: #111; font-weight: 500; font-family: monospace; }
      .ag-trusted { color: #16a34a !important; }
      .ag-issues {
        background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
        padding: 12px 16px; margin-bottom: 16px;
      }
      .ag-issues h4 { margin: 0 0 8px 0; font-size: 13px; color: #991b1b; }
      .ag-issues ul { margin: 0; padding-left: 16px; }
      .ag-issues li { margin: 4px 0; font-size: 12px; color: #7f1d1d; line-height: 1.4; }
      .ag-amount-modifier {
        background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
        padding: 12px 16px; margin-bottom: 16px;
      }
      .ag-amount-modifier h4 { margin: 0 0 6px 0; font-size: 13px; color: #92400e; }
      .ag-hint { font-size: 12px; color: #78716c; margin: 4px 0 8px 0; }
      .ag-amount-input-wrap { display: flex; gap: 8px; }
      .ag-amount-input {
        flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px;
        font-size: 13px; font-family: monospace; outline: none;
      }
      .ag-amount-input:focus { border-color: #00A896; box-shadow: 0 0 0 2px rgba(0,168,150,0.15); }
      .ag-pro-section {
        background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
        padding: 12px 16px; margin-bottom: 16px;
      }
      .ag-pro-section h4 { margin: 0 0 8px 0; font-size: 13px; color: #166534; }
      .ag-upgrade-prompt {
        background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px;
        padding: 12px 16px; margin-bottom: 16px;
      }
      .ag-upgrade-prompt p { margin: 0; font-size: 12px; color: #5b21b6; line-height: 1.4; }
      .ag-recommendation {
        font-size: 13px; color: #374151; margin: 12px 0 0 0; line-height: 1.5;
        padding-top: 12px; border-top: 1px solid #e5e7eb;
      }
      .ag-warning-actions {
        padding: 16px 20px; border-top: 1px solid #e5e7eb;
        display: flex; gap: 10px; justify-content: flex-end;
      }
      .ag-btn {
        padding: 10px 18px; border: none; border-radius: 8px;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
      }
      .ag-btn-primary { background: #00A896; color: #fff; }
      .ag-btn-primary:hover { background: #008B7A; }
      .ag-btn-secondary { background: #f3f4f6; color: #374151; }
      .ag-btn-secondary:hover { background: #e5e7eb; }
      .ag-btn-outline { background: #fff; color: #00A896; border: 1px solid #00A896; }
      .ag-btn-outline:hover { background: #f0fdfa; }
    `;
    document.head.appendChild(style);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AllowanceGuardExtension());
} else {
  new AllowanceGuardExtension();
}
