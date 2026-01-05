// frontend/app.js
const API_BASE = "http://localhost:8000";

/* =========================
   Soft dark-mode color theme
   ========================= */
const chartTheme = {
  text: "#e5e7eb",          // light gray text
  muted: "#9ca3af",         // muted axis labels
  grid: "rgba(255,255,255,0.08)",

  revenue: {
    fill: "rgba(144, 231, 160, 0.35)",   // soft blue
    border: "rgba(99, 179, 237, 0.9)",
  },

  service: {
    fill: "rgba(250, 139, 174, 0.35)",  // soft purple
    border: "rgba(237, 139, 250, 0.9)",
  },
};

function baseBarOptions() {
  return {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: chartTheme.text,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: chartTheme.text,
        bodyColor: chartTheme.text,
        borderColor: chartTheme.grid,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: chartTheme.muted },
        grid: { color: chartTheme.grid },
      },
      y: {
        ticks: { color: chartTheme.muted },
        grid: { color: chartTheme.grid },
      },
    },
  };
}

/* =========================
   Summary cards
   ========================= */
async function loadSummary() {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();

  document.getElementById("total-revenue").textContent =
    Number(data.total_revenue).toFixed(2);

  document.getElementById("total-appointments").textContent =
    data.total_appointments;

  document.getElementById("average-duration").textContent =
    Number(data.average_duration).toFixed(1);
}

/* =========================
   Revenue chart
   ========================= */
let revenueChart;

async function loadRevenueChart() {
  const res = await fetch(`${API_BASE}/stats/revenue_by_day`);
  const data = await res.json();

  const labels = data.map(d => d.date);
  const values = data.map(d => Number(d.total_revenue));

  const ctx = document.getElementById("revenue-chart").getContext("2d");

  if (revenueChart) revenueChart.destroy();

  revenueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue by day",
          data: values,
          backgroundColor: chartTheme.revenue.fill,
          borderColor: chartTheme.revenue.border,
          borderWidth: 1,
        },
      ],
    },
    options: baseBarOptions(),
  });
}

/* =========================
   Service popularity chart
   ========================= */
let serviceChart;

async function loadServiceChart() {
  const res = await fetch(`${API_BASE}/stats/service_popularity`);
  const data = await res.json();

  const labels = data.map(d => d.service_type);
  const values = data.map(d => Number(d.count));

  const ctx = document.getElementById("service-chart").getContext("2d");

  if (serviceChart) serviceChart.destroy();

  serviceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Service popularity",
          data: values,
          backgroundColor: chartTheme.service.fill,
          borderColor: chartTheme.service.border,
          borderWidth: 1,
        },
      ],
    },
    options: baseBarOptions(),
  });
}

/* =========================
   Appointments table
   ========================= */
async function loadAppointments() {
  const res = await fetch(`${API_BASE}/appointments?limit=50`);
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

/* =========================
   Init
   ========================= */
async function init() {
  await loadSummary();
  await loadRevenueChart();
  await loadServiceChart();
  await loadAppointments();
}

init();
