// frontend/app.js
const API_BASE = "http://localhost:8000";

// Dark theme colors for Chart.js
const chartTheme = {
  text: "#e5e7eb",
  muted: "#9ca3af",
  grid: "#374151",
  barFill: "rgba(96, 165, 250, 0.70)",
  barBorder: "rgba(96, 165, 250, 1)",
};

function makeBarChartConfig({ labels, values, label }) {
  return {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: chartTheme.barFill,
          borderColor: chartTheme.barBorder,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: chartTheme.text },
        },
        tooltip: {
          titleColor: chartTheme.text,
          bodyColor: chartTheme.text,
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
    },
  };
}

async function loadSummary() {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
  document.getElementById("total-revenue").textContent = Number(data.total_revenue).toFixed(2);
  document.getElementById("total-appointments").textContent = data.total_appointments;
  document.getElementById("average-duration").textContent = Number(data.average_duration).toFixed(1);
}

let revenueChartInstance = null;
async function loadRevenueChart() {
  const res = await fetch(`${API_BASE}/stats/revenue_by_day`);
  const data = await res.json();

  const labels = data.map((d) => d.date);
  const values = data.map((d) => Number(d.total_revenue));

  const ctx = document.getElementById("revenue-chart").getContext("2d");

  // If you refresh/re-init, destroy old chart to avoid duplicates
  if (revenueChartInstance) revenueChartInstance.destroy();

  revenueChartInstance = new Chart(
    ctx,
    makeBarChartConfig({
      labels,
      values,
      label: "Revenue by day",
    })
  );
}

let serviceChartInstance = null;
async function loadServiceChart() {
  const res = await fetch(`${API_BASE}/stats/service_popularity`);
  const data = await res.json();

  const labels = data.map((d) => d.service_type);
  const values = data.map((d) => Number(d.count));

  const ctx = document.getElementById("service-chart").getContext("2d");

  if (serviceChartInstance) serviceChartInstance.destroy();

  serviceChartInstance = new Chart(
    ctx,
    makeBarChartConfig({
      labels,
      values,
      label: "Service popularity",
    })
  );
}

async function loadAppointments() {
  const res = await fetch(`${API_BASE}/appointments?limit=50`);
  const data = await res.json();

  const tbody = document.querySelector("#appointments-table tbody");
  tbody.innerHTML = "";

  data.forEach((row) => {
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

async function init() {
  await loadSummary();
  await loadRevenueChart();
  await loadServiceChart();
  await loadAppointments();
}

init();
