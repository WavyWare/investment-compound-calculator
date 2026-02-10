let phases = [
  {
    id: "p1",
    type: "deposit",
    amount: 1000,
    duration: 10,
    durationUnit: "years",
    rate: 7,
    isNet: false,
    taxRate: 19,
    active: true,
  },
  {
    id: "p2",
    type: "wait",
    amount: 0,
    duration: 5,
    durationUnit: "years",
    rate: 7,
    isNet: false,
    taxRate: 19,
    active: true,
  },
  {
    id: "p3",
    type: "withdraw",
    amount: 2000,
    duration: 10,
    durationUnit: "years",
    rate: 5,
    isNet: false,
    taxRate: 19,
    active: true,
  },
];

let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-phase-btn").addEventListener("click", addPhase);

  const ageInput = document.getElementById("start-age");
  ageInput.addEventListener("input", () => {
    updateAgeLabels();
  });

  // Initialize SortableJS for Drag and Drop
  const el = document.getElementById("phases-container");
  Sortable.create(el, {
    handle: ".drag-handle", // Drag handle selector
    animation: 150, // Smooth animation
    onEnd: function (evt) {
      // Reorder array based on new index
      const item = phases.splice(evt.oldIndex, 1)[0];
      phases.splice(evt.newIndex, 0, item);

      // Re-render to ensure data-indices are correct, then update charts
      renderPhases();
      calculateAndDraw();
    },
  });

  renderPhases();
  calculateAndDraw();
});

function renderPhases() {
  const container = document.getElementById("phases-container");
  container.innerHTML = "";

  phases.forEach((phase, index) => {
    const card = document.createElement("div");
    // Add disabled class if inactive
    const disabledClass = phase.active ? "" : "phase-disabled";
    card.className = `card phase-card p-3 type-${phase.type} ${disabledClass}`;
    card.setAttribute("data-id", phase.id); // For Sortable tracking

    const typeSelect = createSelect(phase.type, index);
    const amountInput = createInput(
      "number",
      phase.amount,
      index,
      "amount",
      phase.type === "wait",
    );
    const durationInput = createInput(
      "number",
      phase.duration,
      index,
      "duration",
    );
    const rateInput = createInput(
      "number",
      phase.rate,
      index,
      "rate",
      false,
      0.1,
    );

    // Toggle Icon (Eye)
    const toggleIcon = phase.active ? "bi-eye-fill" : "bi-eye-slash";
    const toggleTitle = phase.active ? "Disable Phase" : "Enable Phase";
    const toggleClass = phase.active ? "active-phase" : "";

    // Tax Logic (Only for Withdrawals)
    let taxSection = "";
    if (phase.type === "withdraw") {
      const isChecked = phase.isNet ? "checked" : "";
      const taxInputVisibility = phase.isNet ? "block" : "none";

      taxSection = `
                <div class="tax-settings-container">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="form-check m-0">
                            <input class="form-check-input" type="checkbox" id="tax-check-${index}"
                                ${isChecked}
                                onchange="updatePhase(${index}, 'isNet', this.checked)">
                            <label class="form-check-label small fw-bold text-danger" for="tax-check-${index}">
                                Withdraw as Net Amount? (Simulate Tax)
                            </label>
                        </div>
                    </div>

                    <div style="display: ${taxInputVisibility}; margin-top: 10px; border-top: 1px solid #f5c6cb; padding-top: 10px;">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <label class="col-form-label col-form-label-sm small text-muted">Tax Rate (%):</label>
                            </div>
                            <div class="col">
                                <input type="number" class="form-control form-control-sm"
                                    value="${phase.taxRate}" min="0" max="100" step="0.1"
                                    oninput="updatePhase(${index}, 'taxRate', this.value)">
                            </div>
                            <div class="col-auto">
                                <span class="small text-muted">Gross adjusted.</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }

    card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center flex-wrap flex-grow-1">
                    <i class="bi bi-grip-vertical drag-handle" title="Drag to reorder"></i>
                    ${typeSelect}
                    <span class="age-badge" id="age-badge-${index}"></span>
                </div>

                <div class="d-flex align-items-center">
                    <i class="bi ${toggleIcon} action-btn toggle-btn ${toggleClass}"
                       onclick="togglePhase(${index})"
                       title="${toggleTitle}"></i>

                    <i class="bi bi-trash action-btn delete-btn"
                       onclick="removePhase(${index})"
                       title="Remove this phase"></i>
                </div>
            </div>

            <div class="row g-2">
                <div class="col-md-4">
                    <label class="form-label small text-muted mb-0">Amount (mo)</label>
                    ${amountInput}
                </div>
                <div class="col-md-4">
                    <label class="form-label small text-muted mb-0">Time (yrs)</label>
                    ${durationInput}
                </div>
                <div class="col-md-4">
                    <label class="form-label small text-muted mb-0">Return Rate (%)</label>
                    ${rateInput}
                </div>
            </div>

            ${taxSection}
        `;
    container.appendChild(card);
  });

  updateAgeLabels();
}

function updateAgeLabels() {
  const startAgeInput = document.getElementById("start-age").value;
  let currentAge = startAgeInput ? parseFloat(startAgeInput) : null;

  phases.forEach((phase, index) => {
    const badge = document.getElementById(`age-badge-${index}`);

    // Only calculate age if the phase is active and start age is provided
    if (currentAge !== null && !isNaN(currentAge)) {
      if (phase.active) {
        currentAge += phase.duration;
      }

      const displayAge = Number.isInteger(currentAge)
        ? currentAge
        : currentAge.toFixed(1);
      badge.innerText = `Age: ${displayAge}`;
      badge.style.display = "inline-block";

      // Dim badge if inactive
      badge.style.opacity = phase.active ? "1" : "0.5";
    } else {
      badge.style.display = "none";
    }
  });
}

function createSelect(currentType, index) {
  return `
        <select class="form-select form-select-sm w-auto fw-bold ms-2" onchange="updatePhase(${index}, 'type', this.value)">
            <option value="deposit" ${currentType === "deposit" ? "selected" : ""}>🟢 Regular Deposit</option>
            <option value="wait" ${currentType === "wait" ? "selected" : ""}>🟡 Compound Only</option>
            <option value="withdraw" ${currentType === "withdraw" ? "selected" : ""}>🔴 Withdrawal</option>
        </select>
    `;
}

function createInput(type, value, index, field, disabled = false, step = 1) {
  return `<input type="${type}" class="form-control form-control-sm"
            value="${value}" min="0" step="${step}"
            ${disabled ? "disabled" : ""}
            oninput="updatePhase(${index}, '${field}', this.value)">`;
}

function addPhase() {
  phases.push({
    id: "p" + Date.now(), // Unique ID for Sortable
    type: "deposit",
    amount: 500,
    duration: 5,
    durationUnit: "years",
    rate: 6,
    isNet: false,
    taxRate: 19,
    active: true,
  });
  renderPhases();
  calculateAndDraw();
}

function removePhase(index) {
  if (phases.length > 1) {
    phases.splice(index, 1);
    renderPhases();
    calculateAndDraw();
  } else {
    alert("There must be at least one investment phase.");
  }
}

function togglePhase(index) {
  phases[index].active = !phases[index].active;
  renderPhases();
  calculateAndDraw();
}

window.updatePhase = function (index, field, value) {
  let val = value;

  if (field === "isNet") {
    val = value; // Boolean
  } else if (
    field === "amount" ||
    field === "duration" ||
    field === "rate" ||
    field === "taxRate"
  ) {
    val = parseFloat(value) || 0;
  }

  phases[index][field] = val;

  if (field === "type" && val === "wait") {
    phases[index].amount = 0;
    phases[index].isNet = false;
    renderPhases();
  } else if (field === "type") {
    renderPhases();
  } else if (field === "isNet") {
    renderPhases();
  }

  if (field === "duration") {
    updateAgeLabels();
  }

  calculateAndDraw();
};

function calculateData() {
  let labels = [];
  let balanceData = [];
  let investedData = [];

  let currentBalance = 0;
  let totalInvested = 0;
  let totalMonthsPassed = 0;

  labels.push(`Start`);
  balanceData.push(0);
  investedData.push(0);

  phases.forEach((phase) => {
    // Skip inactive phases completely from calculation
    if (!phase.active) return;

    const months = phase.duration * 12;
    const monthlyRate = phase.rate / 100 / 12;

    for (let i = 1; i <= months; i++) {
      const interest = currentBalance * monthlyRate;
      let flow = 0;

      if (phase.type === "deposit") {
        flow = phase.amount;
      } else if (phase.type === "withdraw") {
        let withdrawalAmount = phase.amount;

        if (phase.isNet) {
          const taxRateDecimal = phase.taxRate / 100;
          if (taxRateDecimal < 1) {
            withdrawalAmount = phase.amount / (1 - taxRateDecimal);
          }
        }

        flow = -withdrawalAmount;
      }

      currentBalance += interest + flow;
      totalInvested += flow;
      totalMonthsPassed++;

      const year = Math.floor(totalMonthsPassed / 12);
      const month = totalMonthsPassed % 12;

      labels.push(`Year ${year} Month ${month === 0 ? 12 : month}`);
      balanceData.push(currentBalance);
      investedData.push(totalInvested);
    }
  });

  return { labels, balanceData, investedData };
}

function calculateAndDraw() {
  const { labels, balanceData, investedData } = calculateData();
  const finalBalance = balanceData[balanceData.length - 1] || 0;
  const finalInvested = investedData[investedData.length - 1] || 0;
  const finalInterest = finalBalance - finalInvested;

  document.getElementById("final-balance").innerText =
    formatCurrency(finalBalance);
  document.getElementById("total-invested").innerText =
    formatCurrency(finalInvested);
  document.getElementById("total-interest").innerText =
    formatCurrency(finalInterest);

  const ctx = document.getElementById("investmentChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(13, 110, 253, 0.2)");
  gradient.addColorStop(1, "rgba(13, 110, 253, 0)");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Investment Value",
          data: balanceData,
          borderColor: "#0d6efd",
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          pointHitRadius: 10,
          tension: 0.4,
        },
        {
          label: "Principal Capital",
          data: investedData,
          borderColor: "#adb5bd",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + formatCurrency(context.raw);
            },
          },
        },
        legend: { position: "top" },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              });
            },
          },
        },
        x: {
          ticks: { maxTicksLimit: 12 },
        },
      },
      onClick: (e) => {
        const points = chartInstance.getElementsAtEventForMode(
          e,
          "index",
          { intersect: false },
          true,
        );
        if (points.length) {
          const index = points[0].index;
          showDetails(labels[index], balanceData[index], investedData[index]);
        }
      },
    },
  });
}

function showDetails(label, balance, invested) {
  const detailBox = document.getElementById("detail-info");
  const profit = balance - invested;

  document.getElementById("detail-month").innerText = label;
  document.getElementById("detail-balance").innerText = formatCurrency(balance);
  document.getElementById("detail-contribution").innerText =
    formatCurrency(invested);
  document.getElementById("detail-profit").innerText = formatCurrency(profit);

  detailBox.style.display = "block";
}

function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
