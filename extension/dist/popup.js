/**
 * AllowanceGuard Browser Extension - Popup Script
 * 
 * This script handles the extension popup UI:
 * 1. Display current status and settings
 * 2. Show statistics
 * 3. Handle user interactions
 */

class AllowanceGuardPopup {
  constructor() {
    this.init();
  }

  async init() {
    console.log('🛡️ AllowanceGuard Extension: Popup loaded');
    
    // Load settings and update UI
    await this.loadSettings();
    
    // Load statistics
    await this.loadStats();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const settings = await this.getSettings();
      this.updateStatusUI(settings.enabled);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async loadStats() {
    try {
      const events = await this.getEvents();
      const today = new Date().toDateString();
      
      // Count scans and warnings from today
      const todayEvents = events.filter(event => 
        new Date(event.timestamp).toDateString() === today
      );
      
      const scansToday = todayEvents.filter(event => 
        event.type === 'risk_assessment'
      ).length;
      
      const warningsBlocked = todayEvents.filter(event => 
        event.type === 'warning_shown' && event.riskLevel >= 3
      ).length;
      
      document.getElementById('scansToday').textContent = scansToday;
      document.getElementById('warningsBlocked').textContent = warningsBlocked;
    } catch (error) {
      console.error('Error loading stats:', error);
      document.getElementById('scansToday').textContent = '0';
      document.getElementById('warningsBlocked').textContent = '0';
    }
  }

  setupEventListeners() {
    // Toggle switch
    const toggle = document.getElementById('toggle');
    toggle.addEventListener('click', () => {
      this.toggleExtension();
    });
    
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    settingsBtn.addEventListener('click', () => {
      this.openSettings();
    });
  }

  updateStatusUI(enabled) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const toggle = document.getElementById('toggle');
    
    if (enabled) {
      statusIndicator.classList.remove('inactive');
      statusIndicator.classList.add('active');
      statusText.textContent = 'Protection Active';
      toggle.classList.add('active');
    } else {
      statusIndicator.classList.remove('active');
      statusIndicator.classList.add('inactive');
      statusText.textContent = 'Protection Disabled';
      toggle.classList.remove('active');
    }
  }

  async toggleExtension() {
    try {
      const settings = await this.getSettings();
      const newEnabled = !settings.enabled;
      
      await this.updateSettings({ enabled: newEnabled });
      this.updateStatusUI(newEnabled);
      
      // Log the toggle event
      await this.logEvent({
        type: 'extension_toggled',
        enabled: newEnabled,
        timestamp: Date.now()
      });
      
      // Notify content scripts of the change
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'EXTENSION_TOGGLED',
            enabled: newEnabled
          });
        }
      });
    } catch (error) {
      console.error('Error toggling extension:', error);
    }
  }

  openSettings() {
    // Open settings page in a new tab
    chrome.tabs.create({
      url: 'https://www.allowanceguard.com/settings'
    });
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

  async getEvents() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['events'], (result) => {
        resolve(result.events || []);
      });
    });
  }

  async logEvent(eventData) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['events'], (result) => {
        const events = result.events || [];
        events.push(eventData);
        
        // Keep only last 100 events
        if (events.length > 100) {
          events.splice(0, events.length - 100);
        }
        
        chrome.storage.local.set({ events }, resolve);
      });
    });
  }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AllowanceGuardPopup();
});
