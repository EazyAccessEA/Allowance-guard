/**
 * AllowanceGuard Browser Extension - Background Script (Service Worker)
 * 
 * This service worker handles:
 * 1. Extension lifecycle events
 * 2. API communication with AllowanceGuard
 * 3. Storage management
 * 4. Cross-tab communication
 */

class AllowanceGuardBackground {
  constructor() {
    this.init();
  }

  init() {
    console.log('🛡️ AllowanceGuard Extension: Background script loaded');
    
    // Handle extension installation
    chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    
    // Handle messages from content scripts
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Handle tab updates
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
  }

  handleInstall(details) {
    console.log('Extension installed:', details);
    
    if (details.reason === 'install') {
      // Set default settings
      chrome.storage.sync.set({
        enabled: true,
        riskThreshold: 2, // Medium risk and above
        showNotifications: true,
        apiEndpoint: 'https://www.allowanceguard.com'
      });
      
      // Open welcome page
      chrome.tabs.create({
        url: 'https://www.allowanceguard.com/extension-welcome'
      });
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.type) {
        case 'ASSESS_RISK':
          const riskData = await this.assessRisk(request.data);
          sendResponse({ success: true, data: riskData });
          break;
          
        case 'GET_SETTINGS':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;
          
        case 'UPDATE_SETTINGS':
          await this.updateSettings(request.data);
          sendResponse({ success: true });
          break;
          
        case 'LOG_EVENT':
          this.logEvent(request.data);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep message channel open for async response
  }

  async assessRisk(transactionData) {
    try {
      const settings = await this.getSettings();
      const apiEndpoint = settings.apiEndpoint || 'https://www.allowanceguard.com';
      
      const response = await fetch(`${apiEndpoint}/api/risk/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AllowanceGuard-Extension/1.0.0'
        },
        body: JSON.stringify({
          walletAddress: transactionData.walletAddress,
          tokenAddress: transactionData.tokenAddress,
          spenderAddress: transactionData.spenderAddress,
          chainId: transactionData.chainId,
          amount: transactionData.amount
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const riskData = await response.json();
      
      // Log the assessment
      this.logEvent({
        type: 'risk_assessment',
        riskLevel: riskData.riskLevel,
        tokenAddress: transactionData.tokenAddress,
        spenderAddress: transactionData.spenderAddress,
        timestamp: Date.now()
      });
      
      return riskData;
    } catch (error) {
      console.error('Error assessing risk:', error);
      
      // Return fallback risk data
      return {
        riskLevel: 1,
        issues: ['Unable to assess risk - API unavailable'],
        tokenName: 'Unknown',
        spenderName: 'Unknown Contract',
        recommendation: 'Proceed with caution'
      };
    }
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        enabled: true,
        riskThreshold: 2,
        showNotifications: true,
        apiEndpoint: 'https://www.allowanceguard.com'
      }, resolve);
    });
  }

  async updateSettings(newSettings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(newSettings, resolve);
    });
  }

  logEvent(eventData) {
    // Store event in local storage for analytics
    chrome.storage.local.get(['events'], (result) => {
      const events = result.events || [];
      events.push({
        ...eventData,
        timestamp: Date.now()
      });
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      chrome.storage.local.set({ events });
    });
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    // Inject content script when page loads
    if (changeInfo.status === 'complete' && tab.url) {
      // Only inject on web pages (not chrome:// or extension pages)
      if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
        this.injectContentScript(tabId);
      }
    }
  }

  async injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
    } catch (error) {
      // Ignore errors for pages where we can't inject (like chrome:// pages)
      console.log('Could not inject content script:', error.message);
    }
  }
}

// Initialize the background script
new AllowanceGuardBackground();
