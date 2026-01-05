const API_BASE = "https://nail-salon-api-512478194076.us-central1.run.app";


let revenueChart = null;
let serviceChart = null;
let revenueByTechChart = null;
let utilizationChart = null;

function getSelectedTechnician() {
  const sel = document.getElementById("tech-filter");
  return sel ? sel.value : "";
}

function qs(params) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) p.set(k, v);
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

function destroyChart(chart) {
  if (chart) chart.destroy();
}

async function loadTechnicians() {
  const res = await fetch(`${API_BASE}/technicians`);
  const techs = await res.json(); // [{technician: "Amy"}, ...]
  const sel = document.getElementById("tech-filter");

  // keep current selection if possible
  const prev = sel.value;

  // reset options
  sel.innerHTML = `<option value="">All</option>`;
  techs.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.technician;
    opt.textContent = t.technician;
    sel.appendChild(opt);
  });

  // restore selection if still exists
  sel.value = prev;
}

async function loadSummary() {
  const technician = getSelectedTechnician();
  const res = await fetch(`${API_BASE}/stats${qs({ technician })}`);
  const data = await res.json();

  document.getElementById("total-revenue").textContent = Number(data.total_revenue).toFixed(2);
  document.getElementById("total-appointments").textContent = data.total_appointments;
  document.getElementById("average-duration").textContent = Number(data.average_duration).toFixed(1);
}

async function loadRevenueChart() {
  const technician = getSelectedTechnician();
  const res = await fetch(`${API_BASE}/stats/revenue_by_day${qs({ technician })}`);
  const data = await res.json();

  const labels = data.map(d => d.date);
  const values = data.map(d => Number(d.total_revenue));

  const ctx = document.getElementById("revenue-chart").getContext("2d");
  destroyChart(revenueChart);

  revenueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Revenue by day", data: values }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#cbd5e1" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } }
      }
    }
  });
}

async function loadServiceChart() {
  const technician = getSelectedTechnician();
  const res = await fetch(`${API_BASE}/stats/service_popularity${qs({ technician })}`);
  const data = await res.json();

  const labels = data.map(d => d.service_type);
  const values = data.map(d => Number(d.count));

  const ctx = document.getElementById("service-chart").getContext("2d");
  destroyChart(serviceChart);

  serviceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Service popularity", data: values }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#cbd5e1" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } }
      }
    }
  });
}

async function loadRevenueByTech() {
  // This is always global; dropdown filter is for other charts/table
  const res = await fetch(`${API_BASE}/stats/revenue_by_technician`);
  const data = await res.json();

  const labels = data.map(d => d.technician);
  const values = data.map(d => Number(d.total_revenue));

  const ctx = document.getElementById("revenue-by-tech-chart").getContext("2d");
  destroyChart(revenueByTechChart);

  revenueByTechChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Revenue by technician", data: values }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#cbd5e1" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } }
      }
    }
  });
}

async function loadUtilization() {
  const res = await fetch(`${API_BASE}/stats/utilization_by_tech_day`);
  const rows = await res.json();
  // rows: [{date, technician, appointments}, ...]

  // Simple “utilization” view:
  // aggregate appointments/day across all techs OR filtered to selected tech
  const selectedTech = getSelectedTechnician();
  const filtered = selectedTech ? rows.filter(r => r.technician === selectedTech) : rows;

  // group by date
  const byDate = new Map();
  filtered.forEach(r => {
    const key = r.date;
    byDate.set(key, (byDate.get(key) || 0) + Number(r.appointments));
  });

  const labels = Array.from(byDate.keys()).sort();
  const values = labels.map(d => byDate.get(d));

  const ctx = document.getElementById("utilization-chart").getContext("2d");
  destroyChart(utilizationChart);

  utilizationChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: selectedTech ? `Appointments per day (${selectedTech})` : "Appointments per day (all techs)",
        data: values
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#cbd5e1" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.15)" } }
      }
    }
  });
}

async function loadAppointments() {
  const technician = getSelectedTechnician();
  const res = await fetch(`${API_BASE}/appointments${qs({ limit: 50, technician })}`);
  const data = await res.json();

  const tbody = document.querySelector("#appointments-table tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.start_time}</td>
      <td>${row.service_type}</td>
      <td>${row.technician}</td>
      <td>${Number(row.price).toFixed(2)}</td>
      <td>${row.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function refreshAll() {
  await loadSummary();
  await loadRevenueChart();
  await loadServiceChart();
  await loadRevenueByTech();
  await loadUtilization();
  await loadAppointments();
}

async function init() {
  await loadTechnicians();

  const sel = document.getElementById("tech-filter");
  sel.addEventListener("change", async () => {
    await refreshAll();
  });

  await refreshAll();
}

init();
