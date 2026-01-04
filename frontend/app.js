const API_BASE = "http://localhost:8000";

async function loadSummary() {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
  document.getElementById("total-revenue").textContent = data.total_revenue.toFixed(2);
  document.getElementById("total-appointments").textContent = data.total_appointments;
  document.getElementById("average-duration").textContent = data.average_duration.toFixed(1);
}

async function loadRevenueChart() {
  const res = await fetch(`${API_BASE}/stats/revenue_by_day`);
  const data = await res.json();
  const labels = data.map(d => d.date);
  const values = data.map(d => Number(d.total_revenue));
  const ctx = document.getElementById("revenue-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Revenue by day", data: values }]
    }
  });
}

async function loadServiceChart() {
  const res = await fetch(`${API_BASE}/stats/service_popularity`);
  const data = await res.json();
  const labels = data.map(d => d.service_type);
  const values = data.map(d => Number(d.count));
  const ctx = document.getElementById("service-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Service popularity", data: values }]
    }
  });
}

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
      <td>${row.price.toFixed(2)}</td>
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
