/* ============================================================
   AllowanceGuard Pricing — Application Logic
   Billing toggle + feature comparison table rendering.
   ============================================================ */

// --- State ---
let isYearly = false;

// --- DOM References ---
const toggleMonthly = document.getElementById('toggle-monthly');
const toggleYearly = document.getElementById('toggle-yearly');
const indicator = document.getElementById('toggle-indicator');
const billingToggle = document.querySelector('.billing-toggle');
const comparisonBody = document.getElementById('comparison-body');

// --- Feature Comparison Data ---
const FEATURES = [
  { group: 'Core' },
  { name: 'Wallets', free: '3', pro: 'Unlimited', sentinel: '50' },
  { name: 'Chain support', free: 'Single', pro: 'All 10 chains', sentinel: 'All 10 chains' },
  { name: 'Risk labels', free: true, pro: true, sentinel: true },
  { name: 'Manual revocation', free: true, pro: true, sentinel: true },
  { name: 'Time Machine', free: false, pro: true, sentinel: true },
  { group: 'Monitoring' },
  { name: 'Continuous monitoring', free: false, pro: true, sentinel: true },
  { name: 'Email alerts', free: false, pro: true, sentinel: true },
  { name: 'Telegram alerts', free: false, pro: true, sentinel: true },
  { name: 'Historical risk timeline', free: false, pro: true, sentinel: true },
  { group: 'Security' },
  { name: 'Batch revocation', free: false, pro: true, sentinel: true },
  { name: 'Gas savings display', free: false, pro: true, sentinel: true },
  { name: 'Automated revocation rules', free: false, pro: false, sentinel: true },
  { name: 'Export audit reports (PDF/CSV)', free: false, pro: true, sentinel: true },
  { group: 'Collaboration' },
  { name: 'Team dashboard', free: false, pro: false, sentinel: true },
  { name: 'Role-based access (RBAC)', free: false, pro: false, sentinel: true },
  { name: 'Compliance-ready audit logs', free: false, pro: false, sentinel: true },
  { name: 'Webhook integrations', free: false, pro: false, sentinel: true },
  { group: 'Support' },
  { name: 'Community support', free: true, pro: true, sentinel: true },
  { name: 'Priority support', free: false, pro: true, sentinel: true },
  { name: 'Custom onboarding', free: false, pro: false, sentinel: true },
];

// --- Render comparison table ---
function renderComparison() {
  comparisonBody.innerHTML = FEATURES.map(f => {
    if (f.group) {
      return `<tr class="comparison__row comparison__row--group">
        <td class="comparison__td comparison__td--group" colspan="4">${f.group}</td>
      </tr>`;
    }

    const formatCell = (val) => {
      if (val === true) return '<span class="check" aria-label="Included">✓</span>';
      if (val === false) return '<span class="cross" aria-label="Not included">—</span>';
      return `<span class="value">${val}</span>`;
    };

    return `<tr class="comparison__row">
      <td class="comparison__td comparison__td--feature">${f.name}</td>
      <td class="comparison__td comparison__td--value">${formatCell(f.free)}</td>
      <td class="comparison__td comparison__td--value">${formatCell(f.pro)}</td>
      <td class="comparison__td comparison__td--value">${formatCell(f.sentinel)}</td>
    </tr>`;
  }).join('');
}

// --- Billing Toggle ---
function updatePrices() {
  const amounts = document.querySelectorAll('[data-monthly]');
  const periods = document.querySelectorAll('[data-monthly][class*="period"], .tier-card__period[data-monthly]');

  amounts.forEach(el => {
    const key = isYearly ? 'yearly' : 'monthly';
    el.textContent = el.dataset[key];
  });

  // Update period labels
  document.querySelectorAll('.tier-card__period[data-monthly]').forEach(el => {
    const key = isYearly ? 'yearly' : 'monthly';
    el.textContent = el.dataset[key];
  });
}

function setToggle(yearly) {
  isYearly = yearly;

  toggleMonthly.classList.toggle('billing-toggle__option--active', !yearly);
  toggleYearly.classList.toggle('billing-toggle__option--active', yearly);
  toggleMonthly.setAttribute('aria-pressed', String(!yearly));
  toggleYearly.setAttribute('aria-pressed', String(yearly));
  billingToggle.classList.toggle('billing-toggle--yearly', yearly);

  updatePrices();
}

toggleMonthly.addEventListener('click', () => setToggle(false));
toggleYearly.addEventListener('click', () => setToggle(true));

// --- Initialize ---
renderComparison();
