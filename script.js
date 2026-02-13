
// ==========================================
// UTILS
// ==========================================

function formatNumberWithSpaces(value) {
  if (!value && value !== 0 && value !== "0") return "";
  let clean = value.toString().replace(/\s/g, "");
  let parts = clean.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

// ==========================================
// THEME
// ==========================================

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
      window.dispatchEvent(new Event('themeChanged'));
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;

  const toggleBtn = document.getElementById('theme-toggle');
  const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

  if (icon) {
    if (theme === 'dark') {
      icon.classList.remove('bi-moon-stars-fill');
      icon.classList.add('bi-sun-fill');
    } else {
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-stars-fill');
    }
  }
}

// ==========================================
// STATE
// ==========================================

let globalDefaultTaxRate = 19;

const state = {
  mode: 'single',
  scenarios: {
    a: [{
      id: "p1",
      type: "deposit",
      amount: 1000,
      duration: 10,
      durationUnit: "years",
      rate: 12,
      isNet: false,
      taxRate: 19,
      active: true,
    }],
    b: [{
      id: "p1_b",
      type: "deposit",
      amount: 500,
      duration: 10,
      durationUnit: "years",
      rate: 5,
      isNet: false,
      taxRate: 19,
      active: true,
    }]
  }
};

function getPhases(scenarioKey = 'a') {
  return state.scenarios[scenarioKey];
}

// ==========================================
// CALCULATOR
// ==========================================

function calculateData(phases, initialAmount) {
  let labels = [];
  let balanceData = [];
  let investedData = [];

  let currentBalance = initialAmount;
  let totalInvested = initialAmount;
  let totalMonthsPassed = 0;

  labels.push("Start");
  balanceData.push(currentBalance);
  investedData.push(totalInvested);

  phases.forEach((phase) => {
    if (!phase.active) return;

    if (phase.type === "oncedeposit") {
      currentBalance += phase.amount;
      totalInvested += phase.amount;
      totalMonthsPassed++;
      addDataPoint(labels, balanceData, investedData, totalMonthsPassed, currentBalance, totalInvested);
    } else if (phase.type === "oncewithdraw") {
      let withdrawalAmount = calculateWithdrawalAmount(phase);
      currentBalance -= withdrawalAmount;
      totalInvested -= withdrawalAmount;
      totalMonthsPassed++;
      addDataPoint(labels, balanceData, investedData, totalMonthsPassed, currentBalance, totalInvested);
    } else {
      const months = phase.duration * 12;
      const monthlyRate = phase.rate / 100 / 12;

      for (let i = 1; i <= months; i++) {
        const interest = currentBalance * monthlyRate;
        let flow = 0;

        if (phase.type === "deposit") {
          flow = phase.amount;
        } else if (phase.type === "withdraw") {
          let withdrawalAmount = calculateWithdrawalAmount(phase);
          flow = -withdrawalAmount;
        }

        currentBalance += interest + flow;
        totalInvested += flow;
        totalMonthsPassed++;
        addDataPoint(labels, balanceData, investedData, totalMonthsPassed, currentBalance, totalInvested);
      }
    }
  });

  return { labels, balanceData, investedData };
}

function calculateWithdrawalAmount(phase) {
  let amount = phase.amount;
  if (phase.isNet) {
    const taxRateDecimal = phase.taxRate / 100;
    if (taxRateDecimal < 1) {
      amount = phase.amount / (1 - taxRateDecimal);
    }
  }
  return amount;
}

function addDataPoint(labels, balanceData, investedData, totalMonths, balance, invested) {
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths % 12;
  labels.push(`Year ${year} Month ${month === 0 ? 12 : month}`);
  balanceData.push(balance);
  investedData.push(invested);
}

// ==========================================
// CHART
// ==========================================

let chartInstance = null;

function renderChart(ctx, { resultA, resultB }) {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const styles = getComputedStyle(document.body);
  const colorPrimary = styles.getPropertyValue('--bs-primary').trim() || '#0d6efd';
  const colorText = styles.getPropertyValue('--text-color').trim() || '#212529';

  const colorA = colorPrimary;
  const gradientA = ctx.createLinearGradient(0, 0, 0, 400);
  gradientA.addColorStop(0, hexToRgba(colorA, 0.2));
  gradientA.addColorStop(1, hexToRgba(colorA, 0));

  const colorB = '#6610f2';
  const gradientB = ctx.createLinearGradient(0, 0, 0, 400);
  gradientB.addColorStop(0, hexToRgba(colorB, 0.2));
  gradientB.addColorStop(1, hexToRgba(colorB, 0));

  const datasets = [];

  datasets.push({
    label: "Value (A)",
    data: resultA.balanceData,
    borderColor: colorA,
    backgroundColor: gradientA,
    borderWidth: 2,
    fill: true,
    pointRadius: 0,
    pointHitRadius: 10,
    tension: 0.4,
    order: 1
  });
  datasets.push({
    label: "Principal (A)",
    data: resultA.investedData,
    borderColor: colorA,
    borderWidth: 1,
    borderDash: [5, 5],
    fill: false,
    pointRadius: 0,
    tension: 0.1,
    hidden: false,
    order: 2
  });

  if (resultB) {
    datasets.push({
      label: "Value (B)",
      data: resultB.balanceData,
      borderColor: colorB,
      backgroundColor: gradientB,
      borderWidth: 2,
      fill: true,
      pointRadius: 0,
      pointHitRadius: 10,
      tension: 0.4,
      order: 3
    });
    datasets.push({
      label: "Principal (B)",
      data: resultB.investedData,
      borderColor: colorB,
      borderWidth: 1,
      borderDash: [5, 5],
      fill: false,
      pointRadius: 0,
      tension: 0.1,
      order: 4
    });
  }

  let labels = resultA.labels;
  if (resultB && resultB.labels.length > labels.length) {
    labels = resultB.labels;
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + formatCurrency(context.raw);
            },
          },
        },
        legend: {
          position: "top",
          labels: { color: colorText }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: colorText,
            callback: function (value) {
              return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              });
            },
          },
          grid: { color: hexToRgba(colorText, 0.1) }
        },
        x: {
          ticks: { maxTicksLimit: 12, color: colorText },
          grid: { color: hexToRgba(colorText, 0.1) }
        },
      },
      onClick: (e) => {
        const points = chartInstance.getElementsAtEventForMode(e, "index", { intersect: false }, true);
        if (points.length) {
          const idx = points[0].index;
          const valA = resultA.balanceData[idx] || 0;
          const invA = resultA.investedData[idx] || 0;
          let valB, invB;
          if (resultB) {
            valB = resultB.balanceData[idx];
            invB = resultB.investedData[idx];
          }
          if (window.handleChartClick) {
            window.handleChartClick(labels[idx], valA, invA, valB, invB);
          }
        }
      },
    },
  });
}

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r},${g},${b},${alpha})`;
}

// ==========================================
// UI
// ==========================================

function renderLayout(containerId, mode) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (mode === 'single') {
    container.innerHTML = `
            <div class="row">
                <div class="col-lg-7 mb-4">
                    ${getSummaryHTML('a')}
                    <div class="card p-3">
                        <h5 class="card-title">Growth Over Time</h5>
                        <div class="chart-container">
                            <canvas id="investmentChart"></canvas>
                        </div>
                        ${getDetailHTML()}
                    </div>
                     <div class="text-center mt-3">
                        <button class="btn btn-primary" onclick="window.exportToPDF()">
                            <i class="bi bi-file-earmark-pdf"></i> Export to PDF
                        </button>
                    </div>
                </div>
                <div class="col-lg-5 mb-4">
                    ${getSettingsHTML('a', 'Investment Phases')}
                </div>
            </div>
        `;
  } else {
    container.innerHTML = `
            <div class="row">
                <div class="col-lg-3 mb-4">
                    <h5 class="text-center text-primary mb-3">Scenario A</h5>
                    ${getSettingsHTML('a', 'Phases A')}
                </div>
                <div class="col-lg-6 mb-4">
                     <div class="row mb-2">
                        <div class="col-6">${getSummaryHTML('a', true)}</div>
                        <div class="col-6">${getSummaryHTML('b', true)}</div>
                    </div>
                    <div class="card p-3">
                        <h5 class="card-title text-center">Comparison Chart</h5>
                        <div class="chart-container">
                            <canvas id="investmentChart"></canvas>
                        </div>
                        ${getDetailHTML()}
                    </div>
                    <div class="text-center mt-3">
                        <button class="btn btn-primary" onclick="window.exportToPDF()">
                            <i class="bi bi-file-earmark-pdf"></i> Export to PDF
                        </button>
                    </div>
                </div>
                <div class="col-lg-3 mb-4">
                    <h5 class="text-center text-secondary mb-3">Scenario B</h5>
                    ${getSettingsHTML('b', 'Phases B')}
                </div>
            </div>
        `;
  }
}

function getSummaryHTML(scenarioKey, compact = false) {
  const suffix = scenarioKey === 'a' ? '' : '-b';
  const visibility = compact ? 'style="font-size: 0.9rem"' : '';
  return `
        <div class="row mb-3 g-2 justify-content-center">
            <div class="${compact ? 'col-12' : 'col-md-4'}">
                <div class="summary-box p-2">
                    <div class="text-muted small">Final Balance ${scenarioKey.toUpperCase()}</div>
                    <div class="summary-value" id="final-balance${suffix}" ${visibility}>$0</div>
                </div>
            </div>
            ${!compact ? `
            <div class="col-md-4">
                <div class="summary-box p-2">
                    <div class="text-muted small">Total Invested</div>
                    <div class="summary-value text-secondary" id="total-invested${suffix}">$0</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="summary-box p-2">
                    <div class="text-muted small">Total Interest</div>
                    <div class="summary-value text-success" id="total-interest${suffix}">$0</div>
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

function getSettingsHTML(scenarioKey, title) {
  const suffix = scenarioKey === 'a' ? '' : '-b';
  return `
        <div class="card p-3 mb-3 bg-light border-0">
            <div class="row g-3 align-items-center">
                <div class="col-12">
                     <label class="form-label small fw-bold text-secondary mb-1">Initial Capital</label>
                    <div class="input-group input-group-sm mb-2">
                        <span class="input-group-text bg-white text-muted">$</span>
                        <input type="text" id="initial-amount${suffix}" class="form-control" placeholder="0"
                            onfocus="this.value = this.value.replace(/\\s/g, '')"
                            onblur="this.value = window.formatNumberWithSpaces(this.value)"
                        >
                    </div>
                </div>
                 <div class="col-6">
                    <label class="form-label small fw-bold text-secondary mb-1">Start Age</label>
                    <input type="number" id="start-age${suffix}" class="form-control form-control-sm" placeholder="e.g. 30">
                </div>
                 <div class="col-6">
                    <label class="form-label small fw-bold text-secondary mb-1">Def. Tax %</label>
                    <input type="number" id="default-tax${suffix}" class="form-control form-control-sm" 
                           value="${globalDefaultTaxRate}" placeholder="19"
                           onchange="window.updateGlobalTax(this.value, '${scenarioKey}')">
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong class="small text-muted">${title}</strong>
            <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm py-0" onclick="window.triggerAddPhase('${scenarioKey}')">
                    <i class="bi bi-plus"></i> Add
                </button>
            </div>
        </div>
        <div id="phases-container${suffix}" class="phases-container-scrollable"></div>
    `;
}

function getDetailHTML() {
  return `
        <div id="detail-info" class="text-center mt-3 pt-3 border-top" style="display:none">
            <h6 class="text-muted small">
                Details: <span id="detail-month" class="fw-bold"></span>
            </h6>
            <div class="row mt-1 g-1 justify-content-center small">
                <div class="col-auto px-2 border-end">
                    <span class="text-primary fw-bold" id="detail-balance"></span>
                </div>
                <div class="col-auto px-2">
                    <span class="text-success fw-bold" id="detail-profit"></span>
                </div>
            </div>
        </div>
    `;
}

function renderPhases(containerId, phases, scenarioKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  phases.forEach((phase, index) => {
    const card = document.createElement("div");
    const disabledClass = phase.active ? "" : "phase-disabled";
    card.className = `card phase-card p-2 mb-2 type-${phase.type} ${disabledClass}`;
    card.setAttribute("data-id", phase.id);

    const typeSelect = createSelect(phase.type, index, scenarioKey);
    const isOnceType = phase.type === "oncedeposit" || phase.type === "oncewithdraw";
    const amountInput = createInput("text", phase.amount, index, "amount", scenarioKey, phase.type === "wait");
    const durationInput = createInput("number", phase.duration, index, "duration", scenarioKey, isOnceType);
    const rateInput = createInput("number", phase.rate, index, "rate", scenarioKey, isOnceType, 0.1);
    const toggleIcon = phase.active ? "bi-eye-fill" : "bi-eye-slash";
    const toggleClass = phase.active ? "active-phase" : "";

    let taxSection = "";
    if (phase.type === "withdraw" || phase.type === "oncewithdraw") {
      const isChecked = phase.isNet ? "checked" : "";
      taxSection = `
                <div class="mt-2 pt-2 border-top">
                    <div class="d-flex align-items-center justify-content-between">
                         <div class="form-check form-check-inline m-0">
                            <input class="form-check-input" type="checkbox" id="tax-${scenarioKey}-${index}" ${isChecked}
                                onchange="window.updatePhase(${index}, 'isNet', this.checked, '${scenarioKey}')">
                            <label class="form-check-label small" style="font-size:0.75rem" for="tax-${scenarioKey}-${index}">Simulate Tax</label>
                        </div>
                        <div class="d-flex align-items-center" style="width: 100px;">
                             <label class="small me-1 text-muted" style="font-size:0.7rem">Rate%</label>
                             <input type="number" class="form-control form-control-sm px-1 text-center" style="height: 24px; font-size: 0.8rem;"
                               value="${phase.taxRate}"
                               oninput="window.updatePhase(${index}, 'taxRate', this.value, '${scenarioKey}')">
                        </div>
                    </div>
                </div>
            `;
    }

    let inputsRow = "";
    if (isOnceType) {
      inputsRow = `
                <div class="row g-1 mt-1">
                  <div class="col-12">
                     <div class="input-group input-group-sm">
                        <span class="input-group-text p-1 text-muted">Amount</span>
                        ${amountInput}
                    </div>
                  </div>
                </div>
            `;
    } else {
      inputsRow = `
                <div class="row g-1 mt-1">
                  <div class="col-4">
                    <label class="form-label" style="font-size:0.7rem; margin-bottom:1px">Mthly</label>
                    ${amountInput}
                  </div>
                  <div class="col-4">
                    <label class="form-label" style="font-size:0.7rem; margin-bottom:1px">Yrs</label>
                    ${durationInput}
                  </div>
                  <div class="col-4">
                    <label class="form-label" style="font-size:0.7rem; margin-bottom:1px">Rate%</label>
                    ${rateInput}
                  </div>
                </div>
            `;
    }

    card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center flex-grow-1" style="overflow:hidden">
                    <i class="bi bi-grip-vertical drag-handle me-1" style="font-size:1rem"></i>
                    ${typeSelect}
                </div>
                <div class="d-flex align-items-center ms-1">
                    <i class="bi ${toggleIcon} action-btn toggle-btn ${toggleClass}" style="font-size:0.9rem"
                       onclick="window.togglePhase(${index}, '${scenarioKey}')"></i>
                    <i class="bi bi-trash action-btn delete-btn" style="font-size:0.9rem"
                       onclick="window.removePhase(${index}, '${scenarioKey}')"></i>
                </div>
            </div>
            ${inputsRow}
            ${taxSection}
            <div class="text-end mt-1">
                <span class="age-badge" id="age-badge-${scenarioKey}-${index}" style="font-size:0.7rem"></span>
            </div>
        `;
    container.appendChild(card);
  });
}

function createSelect(currentType, index, scenarioKey) {
  return `
    <select class="form-select form-select-sm w-auto fw-bold border-0 p-0 pe-3 shadow-none bg-transparent"
            style="font-size:0.85rem"
            onchange="window.updatePhase(${index}, 'type', this.value, '${scenarioKey}')">
      <option value="deposit" ${currentType === "deposit" ? "selected" : ""}>🟢 Deposit</option>
      <option value="wait" ${currentType === "wait" ? "selected" : ""}>🟡 Wait</option>
      <option value="withdraw" ${currentType === "withdraw" ? "selected" : ""}>🔴 Withdraw</option>
      <option value="oncedeposit" ${currentType === "oncedeposit" ? "selected" : ""}>💚 One-time In</option>
      <option value="oncewithdraw" ${currentType === "oncewithdraw" ? "selected" : ""}>🧡 One-time Out</option>
    </select>
  `;
}

function createInput(type, value, index, field, scenarioKey, disabled = false, step = 1) {
  let displayValue = value;
  if (field === "amount") displayValue = formatNumberWithSpaces(value);
  const events = field === "amount"
    ? `onfocus="this.value = this.value.replace(/\\s/g, '')" onblur="this.value = window.formatNumberWithSpaces(this.value)"`
    : "";

  return `
      <input type="${type}" class="form-control form-control-sm px-1 text-center"
             value="${displayValue}" min="0" step="${step}"
             ${disabled ? "disabled" : ""}
             ${events}
             oninput="window.updatePhase(${index}, '${field}', this.value, '${scenarioKey}')">
    `;
}

function updateAgeLabels(phases, scenarioKey) {
  const inputId = scenarioKey === 'a' ? 'start-age' : 'start-age-b';
  const ageInput = document.getElementById(inputId);
  if (!ageInput) return;

  const startAgeVal = ageInput.value;
  let currentAge = startAgeVal ? parseFloat(startAgeVal) : null;

  phases.forEach((phase, index) => {
    const badge = document.getElementById(`age-badge-${scenarioKey}-${index}`);
    if (!badge) return;
    if (currentAge !== null && !isNaN(currentAge)) {
      if (phase.active && phase.type !== "oncedeposit" && phase.type !== "oncewithdraw") {
        currentAge += phase.duration;
      }
      const displayAge = Number.isInteger(currentAge) ? currentAge : currentAge.toFixed(1);
      badge.innerText = `Age: ${displayAge}`;
      badge.style.display = "inline-block";
      badge.style.opacity = phase.active ? "1" : "0.5";
    } else {
      badge.style.display = "none";
    }
  });
}

function showDetails(label, balanceA, investedA, balanceB, investedB, formatCurrency) {
  const detailBox = document.getElementById("detail-info");
  if (!detailBox) return;

  document.getElementById("detail-month").innerText = label;
  const profitA = balanceA - investedA;
  document.getElementById("detail-balance").innerText = "A: " + formatCurrency(balanceA);
  document.getElementById("detail-profit").innerText = "Gain: " + formatCurrency(profitA);

  if (balanceB !== undefined) {
    document.getElementById("detail-balance").innerHTML += `<br>B: ${formatCurrency(balanceB)}`;
    const profitB = balanceB - investedB;
    document.getElementById("detail-profit").innerHTML += `<br>Gain: ${formatCurrency(profitB)}`;
  }
  detailBox.style.display = "block";
}

// ==========================================
// MAIN
// ==========================================

window.formatNumberWithSpaces = formatNumberWithSpaces;

function main() {
  initTheme();
  state.mode = 'single';
  setupGlobalListeners();
  refreshFullApp();
  window.addEventListener('themeChanged', () => {
    computeAndRender();
  });
}

function setupGlobalListeners() {
  const toggle = document.getElementById('compare-mode-toggle');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      state.mode = e.target.checked ? 'compare' : 'single';
      refreshFullApp();
    });
  }
}

function refreshFullApp() {
  const container = document.getElementById('app-content');
  if (state.mode === 'compare') {
    container.className = 'container-fluid py-2';
  } else {
    container.className = 'container py-0';
  }
  renderLayout('app-content', state.mode);
  attachScenarioListeners('a');
  if (state.mode === 'compare') {
    attachScenarioListeners('b');
  }
  refreshScenarioUI('a');
  if (state.mode === 'compare') {
    refreshScenarioUI('b');
  }
}

function attachScenarioListeners(key) {
  const suffix = key === 'a' ? '' : '-b';
  const initialInput = document.getElementById(`initial-amount${suffix}`);
  if (initialInput) {
    initialInput.addEventListener("input", () => computeAndRender());
  }
  const ageInput = document.getElementById(`start-age${suffix}`);
  if (ageInput) {
    ageInput.addEventListener("input", () => updateAgeLabels(getPhases(key), key));
  }
  const el = document.getElementById(`phases-container${suffix}`);
  if (el) {
    Sortable.create(el, {
      handle: ".drag-handle",
      animation: 150,
      onEnd: function (evt) {
        const p = getPhases(key);
        const item = p.splice(evt.oldIndex, 1)[0];
        p.splice(evt.newIndex, 0, item);
        refreshScenarioUI(key);
      },
    });
  }
}

function refreshScenarioUI(key) {
  const suffix = key === 'a' ? '' : '-b';
  renderPhases(`phases-container${suffix}`, getPhases(key), key);
  updateAgeLabels(getPhases(key), key);
  computeAndRender();
}

function computeAndRender() {
  const resultA = calculateScenario('a');
  let resultB = null;
  if (state.mode === 'compare') {
    resultB = calculateScenario('b');
  }
  updateSummary(resultA, 'a');
  if (resultB) updateSummary(resultB, 'b');

  const ctxEl = document.getElementById("investmentChart");
  if (ctxEl) {
    const ctx = ctxEl.getContext("2d");
    renderChart(ctx, { resultA, resultB });
  }
}

function calculateScenario(key) {
  const suffix = key === 'a' ? '' : '-b';
  const initialInput = document.getElementById(`initial-amount${suffix}`);
  let initialValStr = initialInput ? initialInput.value : "0";
  initialValStr = initialValStr.replace(/\s/g, "");
  const initialAmount = parseFloat(initialValStr) || 0;
  return calculateData(getPhases(key), initialAmount);
}

function updateSummary({ balanceData, investedData }, key) {
  const suffix = key === 'a' ? '' : '-b';
  const finalBalance = balanceData[balanceData.length - 1] || 0;
  const finalInvested = investedData[investedData.length - 1] || 0;
  const finalInterest = finalBalance - finalInvested;

  const elBal = document.getElementById(`final-balance${suffix}`);
  const elInv = document.getElementById(`total-invested${suffix}`);
  const elInt = document.getElementById(`total-interest${suffix}`);

  if (elBal) elBal.innerText = formatCurrency(finalBalance);
  if (elInv) elInv.innerText = formatCurrency(finalInvested);
  if (elInt) elInt.innerText = formatCurrency(finalInterest);
}

// Global functions for inline HTML attributes

window.updateGlobalTax = function (val, key) {
  globalDefaultTaxRate = parseFloat(val) || 19;
  // update all active phases tax rate
  const phases = getPhases(key);
  phases.forEach(p => {
    if (p.type === 'withdraw' || p.type === 'oncewithdraw') {
      p.taxRate = globalDefaultTaxRate;
    }
  });
  refreshScenarioUI(key);
}

window.updatePhase = function (index, field, value, key = 'a') {
  const phases = getPhases(key);
  let val = value;
  if (field === "amount" || field === "duration" || field === "rate" || field === "taxRate") {
    if (typeof value === "string") {
      value = value.replace(/\s/g, "");
    }
    val = parseFloat(value) || 0;
  }

  phases[index][field] = val;

  if (field === "type" && val === "wait") {
    phases[index].amount = 0;
    phases[index].isNet = false;
    refreshScenarioUI(key);
  } else if (field === "type" || field === "isNet") {
    refreshScenarioUI(key);
  } else {
    if (field === "duration") {
      updateAgeLabels(phases, key);
    }
    computeAndRender();
  }
};

window.togglePhase = function (index, key = 'a') {
  const phases = getPhases(key);
  phases[index].active = !phases[index].active;
  refreshScenarioUI(key);
};

window.removePhase = function (index, key = 'a') {
  const phases = getPhases(key);
  if (phases.length > 1) {
    phases.splice(index, 1);
    refreshScenarioUI(key);
  } else {
    alert("At least one phase is required.");
  }
};

window.triggerAddPhase = function (key) {
  const phases = getPhases(key);
  phases.push({
    id: "p" + Date.now(),
    type: "deposit",
    amount: 500,
    duration: 5,
    durationUnit: "years",
    rate: 6,
    isNet: false,
    taxRate: globalDefaultTaxRate,
    active: true,
  });
  refreshScenarioUI(key);
}

window.handleChartClick = function (label, balanceA, investedA, balanceB, investedB) {
  showDetails(label, balanceA, investedA, balanceB, investedB, formatCurrency);
}

window.exportToPDF = async function () {
  if (!window.jspdf) {
    alert("PDF library not loaded. Please refresh the page or check your internet connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(13, 110, 253);
  doc.text("Investment Report", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Generated on: " + new Date().toLocaleString(), 105, 28, { align: "center" });

  const canvas = document.getElementById("investmentChart");

  if (canvas && chartInstance) {
    // Store original state
    const originalScales = chartInstance.options.scales;
    const originalLegend = chartInstance.options.plugins.legend;
    const originalRatio = chartInstance.options.devicePixelRatio;
    const originalAnimation = chartInstance.options.animation;

    try {
      // Apply PDF-friendly settings
      const lightText = '#212529';
      const lightGrid = 'rgba(33, 37, 41, 0.1)';

      chartInstance.options.scales.x.ticks.color = lightText;
      chartInstance.options.scales.y.ticks.color = lightText;
      chartInstance.options.scales.x.grid.color = lightGrid;
      chartInstance.options.scales.y.grid.color = lightGrid;
      chartInstance.options.plugins.legend.labels.color = lightText;
      chartInstance.options.animation = false; // Disable animation

      // Resize for high DPI
      chartInstance.options.devicePixelRatio = 3;
      chartInstance.resize();
      chartInstance.update('none'); // Synchronous update

      // Wait a bit for paint
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);

      const chartImg = tempCanvas.toDataURL("image/png");

      const imgProps = doc.getImageProperties(chartImg);
      const pdfWidth = 180;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(chartImg, "PNG", 15, 40, pdfWidth, pdfHeight);

      let finalY = 40 + pdfHeight + 10;
      finalY = addScenarioToPDF(doc, 'a', "Scenario A", finalY);

      if (state.mode === 'compare') {
        if (finalY > 220) {
          doc.addPage();
          finalY = 20;
        } else {
          finalY += 10;
        }
        finalY = addScenarioToPDF(doc, 'b', "Scenario B", finalY);
      }

      doc.save("investment-report.pdf");

    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      // Restore original state by fully re-rendering the chart
      // This ensures all options (theme, resolution, animation) are reset correctly
      computeAndRender();
    }
  }
}

function addScenarioToPDF(doc, key, title, startY) {
  const phases = getPhases(key);
  const result = calculateScenario(key);
  const finalBalance = result.balanceData[result.balanceData.length - 1] || 0;
  const totalInvested = result.investedData[result.investedData.length - 1] || 0;

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(title, 15, startY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Final Balance: ${formatCurrency(finalBalance)}`, 15, startY + 7);
  doc.text(`Total Invested: ${formatCurrency(totalInvested)}`, 80, startY + 7);
  doc.text(`Net Gain: ${formatCurrency(finalBalance - totalInvested)}`, 140, startY + 7);

  const suffix = key === 'a' ? '' : '-b';
  const initAmount = document.getElementById(`initial-amount${suffix}`)?.value || "0";
  const startAge = document.getElementById(`start-age${suffix}`)?.value || "-";

  doc.text(`Initial Capital: $${initAmount}   |   Start Age: ${startAge}`, 15, startY + 14);

  const tableBody = phases.filter(p => p.active).map(p => {
    let details = "";
    if (p.type === "deposit" || p.type === "withdraw") {
      details = `${formatNumberWithSpaces(p.amount)}/m, ${p.duration} yrs @ ${p.rate}%`;
    } else if (p.type === "wait") {
      details = `${p.duration} years wait`;
    } else {
      details = `One-time ${formatNumberWithSpaces(p.amount)}`;
    }
    let typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);
    if (p.isNet) typeLabel += " (Net)";
    return [typeLabel, details, p.taxRate > 0 ? p.taxRate + "%" : "-"];
  });

  doc.autoTable({
    startY: startY + 18,
    head: [['Phase Type', 'Details', 'Tax Rate']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: key === 'a' ? [13, 110, 253] : [102, 16, 242] },
    styles: { fontSize: 9 },
    margin: { left: 15, right: 15 }
  });

  return doc.lastAutoTable.finalY;
}

document.addEventListener("DOMContentLoaded", main);
