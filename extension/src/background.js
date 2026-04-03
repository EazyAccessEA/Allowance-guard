/**
 * AllowanceGuard Browser Extension - Background Script (Service Worker)
 *
 * Handles:
 * 1. Extension lifecycle events
 * 2. API communication with AllowanceGuard
 * 3. Storage and event logging
 * 4. Badge icon updates based on risk state
 */

class AllowanceGuardBackground {
  constructor() {
    this.init();
  }

  init() {
    console.log('[AllowanceGuard] Background script loaded');

    chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleInstall(details) {
    if (details.reason === 'install') {
      chrome.storage.sync.set({
        enabled: true,
        riskThreshold: 2,
        showNotifications: true,
        apiEndpoint: 'https://www.allowanceguard.com',
        userTier: 'free',
      });

      chrome.tabs.create({
        url: 'https://www.allowanceguard.com/extension-welcome',
      });
    }
  }

  handleMessage(request, _sender, sendResponse) {
    (async () => {
      try {
        switch (request.type) {
          case 'ASSESS_RISK': {
            const riskData = await this.assessRisk(request.data);
            sendResponse({ success: true, data: riskData });
            break;
          }
          case 'GET_SETTINGS': {
            const settings = await this.getSettings();
            sendResponse({ success: true, data: settings });
            break;
          }
          case 'UPDATE_SETTINGS': {
            await this.updateSettings(request.data);
            // Notify all content scripts
            const tabs = await chrome.tabs.query({});
            for (const tab of tabs) {
              try {
                chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED' });
              } catch {
                // tab may not have content script
              }
            }
            sendResponse({ success: true });
            break;
          }
          case 'LOG_EVENT': {
            await this.logEvent(request.data);
            this.updateBadge(request.data);
            sendResponse({ success: true });
            break;
          }
          case 'GET_STATS': {
            const stats = await this.getStats();
            sendResponse({ success: true, data: stats });
            break;
          }
          default:
            sendResponse({ success: false, error: 'Unknown message type' });
        }
      } catch (error) {
        console.error('[AllowanceGuard] Message handler error:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true; // Keep channel open for async
  }

  async assessRisk(transactionData) {
    try {
      const settings = await this.getSettings();
      const apiEndpoint = settings.apiEndpoint || 'https://www.allowanceguard.com';

      const response = await fetch(`${apiEndpoint}/api/risk/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AG-Source': 'extension',
          'X-AG-Version': '2.0.0',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[AllowanceGuard] Risk assessment error:', error);
      return {
        riskLevel: 1,
        riskLevelText: 'Unknown',
        issues: ['Unable to assess risk - API unavailable'],
        tokenName: 'Unknown',
        spenderName: 'Unknown Contract',
        recommendation: 'Proceed with caution',
      };
    }
  }

  updateBadge(event) {
    if (event.type === 'warning_shown' && event.riskLevel >= 3) {
      chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
      chrome.action.setBadgeText({ text: '!' });

      // Clear badge after 30 seconds
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 30000);
    }
  }

  async getStats() {
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const todayEvents = events.filter((e) => now - e.timestamp < dayMs);
    const weekEvents = events.filter((e) => now - e.timestamp < 7 * dayMs);

    return {
      scansToday: todayEvents.filter((e) => e.type === 'risk_assessment').length,
      warningsToday: todayEvents.filter((e) => e.type === 'warning_shown').length,
      blockedToday: todayEvents.filter((e) => e.type === 'warning_shown' && e.riskLevel >= 3).length,
      scansThisWeek: weekEvents.filter((e) => e.type === 'risk_assessment').length,
      totalEvents: events.length,
    };
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        {
          enabled: true,
          riskThreshold: 2,
          showNotifications: true,
          apiEndpoint: 'https://www.allowanceguard.com',
          userTier: 'free',
        },
        resolve,
      );
    });
  }

  async updateSettings(newSettings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(newSettings, resolve);
    });
  }

  async logEvent(eventData) {
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    events.push({ ...eventData, timestamp: Date.now() });

    // Keep only last 500 events
    if (events.length > 500) {
      events.splice(0, events.length - 500);
    }

    await chrome.storage.local.set({ events });
  }
}

new AllowanceGuardBackground();
