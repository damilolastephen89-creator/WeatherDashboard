// /community/reports.js
// Handles crowdsourced weather reports

// Store reports in localStorage for now
function saveReport(city, condition) {
  const reports = JSON.parse(localStorage.getItem("weatherReports")) || [];
  const newReport = {
    city,
    condition,
    timestamp: new Date().toLocaleString()
  };
  reports.push(newReport);
  localStorage.setItem("weatherReports", JSON.stringify(reports));
  displayReports();
}

// Display reports in community feed
function displayReports() {
  const reports = JSON.parse(localStorage.getItem("weatherReports")) || [];
  const feed = document.getElementById("communityFeed");
  feed.innerHTML = "";

  reports.forEach(report => {
    const item = document.createElement("div");
    item.className = "report-item";
    item.textContent = `${report.city}: ${report.condition} (${report.timestamp})`;
    feed.appendChild(item);
  });
}

// Attach form submission
function initReportForm() {
  const form = document.getElementById("reportForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const city = document.getElementById("reportCity").value;
    const condition = document.getElementById("reportCondition").value;
    if (city && condition) {
      saveReport(city, condition);
      form.reset();
    }
  });

  // Load existing reports on page load
  displayReports();
}
