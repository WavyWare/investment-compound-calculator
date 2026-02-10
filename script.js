let phases = [
  {
    id: 1,
    type: "deposit",
    amount: 1000,
    duration: 10,
    durationUnit: "years",
    rate: 7,
  },
  {
    id: 2,
    type: "wait",
    amount: 0,
    duration: 5,
    durationUnit: "years",
    rate: 7,
  },
  {
    id: 3,
    type: "withdraw",
    amount: 2000,
    duration: 10,
    durationUnit: "years",
    rate: 5,
  },
];

let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-phase-btn").addEventListener("click", addPhase);
  renderPhases();
  calculateAndDraw();
});

function renderPhases() {
  const container = document.getElementById("phases-container");
  container.innerHTML = "";

  phases.forEach((phase, index) => {
    const card = document.createElement("div");
    card.className = `card phase-card p-3 type-${phase.type}`;

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

    card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-2">
                ${typeSelect}
                <i class="bi bi-trash delete-btn" data-index="${index}" title="Usuń ten okres"></i>
            </div>
            <div class="row g-2">
                <div class="col-md-4">
                    <label class="form-label small text-muted mb-0">Kwota (mies.)</label>
                    ${amountInput}
                </div>
                <div class="col-md-4">
                    <label class="form-label small text-muted mb-0">Czas (lata)</label>
                    ${durationInput}
                </div>
                <div class="col-md-4">
                    <label class="form-label small text-muted mb-0">Stopa (%)</label>
                    ${rateInput}
                </div>
            </div>
        `;
    container.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => removePhase(e.target.dataset.index));
  });
}

function createSelect(currentType, index) {
  return `
        <select class="form-select form-select-sm w-auto fw-bold" onchange="updatePhase(${index}, 'type', this.value)">
            <option value="deposit" ${currentType === "deposit" ? "selected" : ""}>🟢 Regularne wpłaty</option>
            <option value="wait" ${currentType === "wait" ? "selected" : ""}>🟡 Tylko procent</option>
            <option value="withdraw" ${currentType === "withdraw" ? "selected" : ""}>🔴 Wypłaty</option>
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
    id: Date.now(),
    type: "deposit",
    amount: 500,
    duration: 5,
    durationUnit: "years",
    rate: 6,
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
    alert("Musi istnieć przynajmniej jeden okres inwestycyjny.");
  }
}

window.updatePhase = function (index, field, value) {
  let val = value;
  if (field === "amount" || field === "duration" || field === "rate") {
    val = parseFloat(value) || 0;
  }

  phases[index][field] = val;

  if (field === "type" && val === "wait") {
    phases[index].amount = 0;
    renderPhases();
  } else if (field === "type") {
    renderPhases();
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
    const months = phase.duration * 12;
    const monthlyRate = phase.rate / 100 / 12;

    for (let i = 1; i <= months; i++) {
      const interest = currentBalance * monthlyRate;
      let flow = 0;

      if (phase.type === "deposit") flow = phase.amount;
      else if (phase.type === "withdraw") flow = -phase.amount;

      currentBalance += interest + flow;
      totalInvested += flow;
      totalMonthsPassed++;

      const year = Math.floor(totalMonthsPassed / 12);
      const month = totalMonthsPassed % 12;

      labels.push(`Rok ${year} Mies. ${month === 0 ? 12 : month}`);
      balanceData.push(currentBalance);
      investedData.push(totalInvested);
    }
  });

  return { labels, balanceData, investedData };
}

function calculateAndDraw() {
  const { labels, balanceData, investedData } = calculateData();
  const finalBalance = balanceData[balanceData.length - 1];
  const finalInvested = investedData[investedData.length - 1];
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
          label: "Wartość Inwestycji",
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
          label: "Wpłacony Kapitał (Netto)",
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
              return value.toLocaleString("pl-PL") + " zł";
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
  return value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  });
}
