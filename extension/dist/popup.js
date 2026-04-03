/**
 * AllowanceGuard Browser Extension - Popup Script
 *
 * Displays protection status, daily stats, tier badge,
 * and links to dashboard/settings.
 */

class AllowanceGuardPopup {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadStats();
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const settings = await this.getSettings();
      this.updateStatusUI(settings.enabled);
      this.updateTierBadge(settings.userTier || 'free');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async loadStats() {
    try {
      const response = await this.sendMessage({ type: 'GET_STATS' });
      if (response?.success) {
        const stats = response.data;
        document.getElementById('scansToday').textContent = stats.scansToday;
        document.getElementById('warningsToday').textContent = stats.warningsToday;
        document.getElementById('blockedToday').textContent = stats.blockedToday;
      }
    } catch {
      // Fallback to local calculation
      const events = await this.getEvents();
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      const todayEvents = events.filter((e) => now - e.timestamp < dayMs);

      document.getElementById('scansToday').textContent =
        todayEvents.filter((e) => e.type === 'risk_assessment').length;
      document.getElementById('warningsToday').textContent =
        todayEvents.filter((e) => e.type === 'warning_shown').length;
      document.getElementById('blockedToday').textContent =
        todayEvents.filter((e) => e.type === 'warning_shown' && e.riskLevel >= 3).length;
    }
  }

  setupEventListeners() {
    document.getElementById('toggle').addEventListener('click', () => this.toggleExtension());
    document.getElementById('settingsBtn').addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://www.allowanceguard.com/settings' });
    });
  }

  updateStatusUI(enabled) {
    const indicator = document.getElementById('statusIndicator');
    const text = document.getElementById('statusText');
    const toggle = document.getElementById('toggle');

    if (enabled) {
      indicator.className = 'status-indicator active';
      text.textContent = 'Protection Active';
      toggle.classList.add('active');
    } else {
      indicator.className = 'status-indicator inactive';
      text.textContent = 'Protection Disabled';
      toggle.classList.remove('active');
    }
  }

  updateTierBadge(tier) {
    const badge = document.getElementById('tierBadge');
    const upgradeWrap = document.getElementById('upgradeWrap');

    const tierNames = { free: 'Free', pro: 'Pro', sentinel: 'Sentinel' };
    badge.textContent = tierNames[tier] || 'Free';
    badge.className = `tier-badge tier-${tier || 'free'}`;

    if (tier === 'free') {
      upgradeWrap.innerHTML = `
        <a href="https://www.allowanceguard.com/pricing" target="_blank" class="btn btn-upgrade">
          Upgrade for Enhanced Protection
        </a>
      `;
    } else {
      upgradeWrap.innerHTML = '';
    }
  }

  async toggleExtension() {
    const settings = await this.getSettings();
    const newEnabled = !settings.enabled;
    await this.updateSettings({ enabled: newEnabled });
    this.updateStatusUI(newEnabled);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'EXTENSION_TOGGLED', enabled: newEnabled });
      }
    });
  }

  sendMessage(msg) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(msg, resolve);
    });
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        { enabled: true, riskThreshold: 2, showNotifications: true, apiEndpoint: 'https://www.allowanceguard.com', userTier: 'free' },
        resolve,
      );
    });
  }

  async updateSettings(newSettings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(newSettings, resolve);
    });
  }

  async getEvents() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['events'], (result) => resolve(result.events || []));
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new AllowanceGuardPopup());
