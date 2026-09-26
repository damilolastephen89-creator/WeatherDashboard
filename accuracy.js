// /analytics/charts.js
// Visualize weather trends with Chart.js

function renderTemperatureChart(monthlyData) {
  // monthlyData = [{ month: "Jan", avgTemp: 28 }, { month: "Feb", avgTemp: 30 }, ...]

  const ctx = document.getElementById("temperatureChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: monthlyData.map(d => d.month),
      datasets: [{
        label: "Average Temperature (°C)",
        data: monthlyData.map(d => d.avgTemp),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Average Temperatures" }
      }
    }
  });
}

function renderRainfallChart(monthlyData) {
  // monthlyData = [{ month: "Jan", rainfall: 50 }, { month: "Feb", rainfall: 20 }, ...]

  const ctx = document.getElementById("rainfallChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: monthlyData.map(d => d.month),
      datasets: [{
        label: "Rainfall (mm)",
        data: monthlyData.map(d => d.rainfall),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Monthly Rainfall Distribution" }
      }
    }
  });
}
