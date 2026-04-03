/**
 * AllowanceGuard Browser Extension - Background Script (Firefox)
 *
 * Firefox MV2 adaptation: uses browser.* API with chrome.* polyfill fallback.
 * Handles:
 * 1. Extension lifecycle events
 * 2. API communication with AllowanceGuard
 * 3. Storage and event logging
 * 4. Badge icon updates based on risk state
 */

const api = typeof browser !== 'undefined' ? browser : chrome;

class AllowanceGuardBackground {
  constructor() {
    this.init();
  }

  init() {
    console.log('[AllowanceGuard] Background script loaded (Firefox)');

    api.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    api.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleInstall(details) {
    if (details.reason === 'install') {
      api.storage.sync.set({
        enabled: true,
        riskThreshold: 2,
        showNotifications: true,
        apiEndpoint: 'https://www.allowanceguard.com',
        userTier: 'free',
      });

      api.tabs.create({
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
            const tabs = await api.tabs.query({});
            for (const tab of tabs) {
              try {
                api.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED' });
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
          'X-AG-Source': 'extension-firefox',
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
      api.browserAction.setBadgeBackgroundColor({ color: '#EF4444' });
      api.browserAction.setBadgeText({ text: '!' });

      setTimeout(() => {
        api.browserAction.setBadgeText({ text: '' });
      }, 30000);
    }
  }

  async getStats() {
    const result = await api.storage.local.get(['events']);
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
    return api.storage.sync.get({
      enabled: true,
      riskThreshold: 2,
      showNotifications: true,
      apiEndpoint: 'https://www.allowanceguard.com',
      userTier: 'free',
    });
  }

  async updateSettings(newSettings) {
    return api.storage.sync.set(newSettings);
  }

  async logEvent(eventData) {
    const result = await api.storage.local.get(['events']);
    const events = result.events || [];
    events.push({ ...eventData, timestamp: Date.now() });

    if (events.length > 500) {
      events.splice(0, events.length - 500);
    }

    await api.storage.local.set({ events });
  }
}

new AllowanceGuardBackground();
