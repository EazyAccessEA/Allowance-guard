/* ============================================================
   AllowanceGuard Dashboard — Application Logic
   Mock data, filtering, Time Machine, batch actions.
   ============================================================ */

// --- Mock Data (realistic token approvals) ---
const APPROVALS = [
  {
    id: 1, token: 'USDC', spender: '0x68b3...4a2F',
    amount: 'Unlimited', risk: 'critical', chain: 'Ethereum',
    lastActive: '2 hours ago', color: '#2775CA',
  },
  {
    id: 2, token: 'WETH', spender: '0x7a25...1bC3',
    amount: '50.0 WETH', risk: 'high', chain: 'Ethereum',
    lastActive: '1 day ago', color: '#627EEA',
  },
  {
    id: 3, token: 'DAI', spender: '0x3fC9...8dE1',
    amount: '10,000 DAI', risk: 'medium', chain: 'Polygon',
    lastActive: '3 days ago', color: '#F5AC37',
  },
  {
    id: 4, token: 'UNI', spender: '0x9bA4...2fF7',
    amount: 'Unlimited', risk: 'high', chain: 'Arbitrum',
    lastActive: '5 days ago', color: '#FF007A',
  },
  {
    id: 5, token: 'LINK', spender: '0x1cD8...5eA9',
    amount: '500 LINK', risk: 'low', chain: 'Base',
    lastActive: '2 weeks ago', color: '#2A5ADA',
  },
  {
    id: 6, token: 'AAVE', spender: '0x4eF2...7cB6',
    amount: '25.5 AAVE', risk: 'medium', chain: 'Optimism',
    lastActive: '1 week ago', color: '#B6509E',
  },
  {
    id: 7, token: 'SNX', spender: '0x2dA7...9fC4',
    amount: 'Unlimited', risk: 'critical', chain: 'Avalanche',
    lastActive: '6 hours ago', color: '#00D1FF',
  },
];

// Chain colors for filter dots
const CHAIN_COLORS = {
  Ethereum: '#627EEA', Polygon: '#8247E5', Arbitrum: '#28A0F0',
  Base: '#0052FF', Optimism: '#FF0420', Avalanche: '#E84142',
};

// Risk config: icon + label (color is never the sole indicator)
const RISK_CONFIG = {
  low:      { icon: '✓', label: 'Low' },
  medium:   { icon: '⚠', label: 'Medium' },
  high:     { icon: '▲', label: 'High' },
  critical: { icon: '✕', label: 'Critical' },
};

// --- State ---
let activeChain = 'all';
let timeMachineOn = false;
const selected = new Set();

// --- DOM References ---
const tableBody = document.getElementById('table-body');
const emptyState = document.getElementById('empty-state');
const emptyText = document.getElementById('empty-state-text');
const selectAll = document.getElementById('select-all');
const batchBar = document.getElementById('batch-bar');
const batchCount = document.getElementById('batch-count');
const batchRevoke = document.getElementById('batch-revoke');
const tmToggle = document.getElementById('time-machine-toggle');
const tmBadge = document.getElementById('tm-badge');
const gaugeEl = document.getElementById('gauge-fill');

// Stat elements
const statTotal = document.getElementById('stat-total');
const statRisk = document.getElementById('stat-risk');
const statValue = document.getElementById('stat-value');
const statScore = document.getElementById('stat-score');

// --- Rendering ---

/** Get filtered approvals based on chain + time machine state */
function getFiltered() {
  let data = APPROVALS;
  if (activeChain !== 'all') {
    data = data.filter(a => a.chain === activeChain);
  }
  return data;
}

/** Check if a row should be dimmed (Time Machine hides high-risk) */
function isDimmed(approval) {
  return timeMachineOn && (approval.risk === 'critical' || approval.risk === 'high');
}

/** Build a single table row */
function buildRow(a) {
  const dimmed = isDimmed(a);
  const isSelected = selected.has(a.id);
  const rowClasses = [
    'approval-table__row',
    isSelected ? 'approval-table__row--selected' : '',
    dimmed ? 'approval-table__row--dimmed' : '',
  ].filter(Boolean).join(' ');

  return `
    <tr class="${rowClasses}" data-id="${a.id}">
      <td class="approval-table__td approval-table__td--check">
        <input type="checkbox" ${isSelected ? 'checked' : ''} ${dimmed ? 'disabled' : ''}
               aria-label="Select ${a.token} approval" data-check="${a.id}">
      </td>
      <td class="approval-table__td">
        <div class="token-cell">
          <span class="token-cell__icon" style="background:${a.color}"
                aria-hidden="true">${a.token[0]}</span>
          <span class="token-cell__name">${a.token}</span>
        </div>
      </td>
      <td class="approval-table__td spender-cell">${a.spender}</td>
      <td class="approval-table__td ${a.amount === 'Unlimited' ? 'amount-cell--unlimited' : ''}">
        ${a.amount}
      </td>
      <td class="approval-table__td">
        <span class="risk-badge risk-badge--${a.risk}"
              aria-label="Risk level: ${RISK_CONFIG[a.risk].label}">
          <span class="risk-badge__icon" aria-hidden="true">${RISK_CONFIG[a.risk].icon}</span>
          ${RISK_CONFIG[a.risk].label}
        </span>
      </td>
      <td class="approval-table__td">
        <span class="chain-cell">
          <span class="chain-cell__dot"
                style="background:${CHAIN_COLORS[a.chain] || '#888'}"
                aria-hidden="true"></span>
          <span class="chain-cell__name">${a.chain}</span>
        </span>
      </td>
      <td class="approval-table__td time-cell">${a.lastActive}</td>
      <td class="approval-table__td approval-table__td--action">
        <button class="btn--ghost-destructive" ${dimmed ? 'disabled' : ''}
                onclick="handleRevoke('${a.token}')"
                aria-label="Revoke ${a.token} approval">Revoke</button>
      </td>
    </tr>`;
}

/** Render the full table */
function render() {
  const filtered = getFiltered();
  if (filtered.length === 0) {
    document.querySelector('.table-wrap').hidden = true;
    emptyState.hidden = false;
    emptyText.textContent = activeChain === 'all'
      ? 'No token approvals found.'
      : `No approvals found on ${activeChain}.`;
  } else {
    document.querySelector('.table-wrap').hidden = false;
    emptyState.hidden = true;
    tableBody.innerHTML = filtered.map(buildRow).join('');
  }
  updateStats();
  updateBatchBar();
  updateSelectAll();
}

/** Update summary stats */
function updateStats() {
  const filtered = getFiltered();
  const visible = timeMachineOn
    ? filtered.filter(a => a.risk !== 'critical' && a.risk !== 'high')
    : filtered;

  const total = visible.length;
  const atRisk = visible.filter(a => a.risk !== 'low').length;

  // Mock value calculation
  const valueMap = { USDC: 45000, WETH: 92500, DAI: 10000, UNI: 12800, LINK: 3750, AAVE: 3200, SNX: 8600 };
  const value = visible.reduce((sum, a) => sum + (valueMap[a.token] || 0), 0);

  const score = timeMachineOn ? 91 : 72;

  statTotal.textContent = total;
  statRisk.textContent = atRisk;
  statValue.textContent = '$' + value.toLocaleString();
  statScore.textContent = score;

  // Update gauge (circumference = 2 * π * 34 ≈ 213.6)
  const circumference = 213.6;
  const offset = circumference * (1 - score / 100);
  gaugeEl.style.strokeDashoffset = offset;
}

/** Update batch action bar visibility */
function updateBatchBar() {
  const count = selected.size;
  if (count > 0) {
    batchBar.hidden = false;
    // Force reflow for animation
    void batchBar.offsetHeight;
    batchBar.classList.add('batch-bar--visible');
    batchCount.textContent = `${count} selected`;
  } else {
    batchBar.classList.remove('batch-bar--visible');
    setTimeout(() => { batchBar.hidden = true; }, 250);
  }
}

/** Sync "select all" checkbox state */
function updateSelectAll() {
  const filtered = getFiltered().filter(a => !isDimmed(a));
  if (filtered.length === 0) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
    return;
  }
  const allSelected = filtered.every(a => selected.has(a.id));
  const someSelected = filtered.some(a => selected.has(a.id));
  selectAll.checked = allSelected;
  selectAll.indeterminate = !allSelected && someSelected;
}

// --- Event Handlers ---

/** Chain filter click */
document.querySelector('.filters').addEventListener('click', (e) => {
  const pill = e.target.closest('.filter-pill');
  if (!pill) return;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
  pill.classList.add('filter-pill--active');
  activeChain = pill.dataset.chain;
  selected.clear();
  render();
});

/** Row checkbox toggle */
tableBody.addEventListener('change', (e) => {
  const check = e.target.closest('[data-check]');
  if (!check) return;
  const id = Number(check.dataset.check);
  if (check.checked) { selected.add(id); } else { selected.delete(id); }
  render();
});

/** Select all toggle */
selectAll.addEventListener('change', () => {
  const filtered = getFiltered().filter(a => !isDimmed(a));
  if (selectAll.checked) {
    filtered.forEach(a => selected.add(a.id));
  } else {
    filtered.forEach(a => selected.delete(a.id));
  }
  render();
});

/** Batch revoke */
batchRevoke.addEventListener('click', () => {
  const tokens = APPROVALS
    .filter(a => selected.has(a.id))
    .map(a => a.token);
  alert('Transaction would revoke: ' + tokens.join(', '));
});

/** Individual revoke */
function handleRevoke(token) {
  alert('Transaction would revoke: ' + token);
}

/** Time Machine toggle */
tmToggle.addEventListener('click', () => {
  timeMachineOn = !timeMachineOn;
  tmToggle.setAttribute('aria-checked', String(timeMachineOn));
  tmBadge.hidden = !timeMachineOn;
  document.body.classList.toggle('time-machine-active', timeMachineOn);
  // Clear selections on dimmed items
  if (timeMachineOn) {
    APPROVALS.forEach(a => {
      if (a.risk === 'critical' || a.risk === 'high') selected.delete(a.id);
    });
  }
  render();
});

// --- Initialize ---
render();
