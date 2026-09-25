// /analytics/accuracy.js
// Compare API forecasts vs crowdsourced reports

function calculateAccuracy(apiForecasts, reports) {
  if (!apiForecasts || !reports || reports.length === 0) return 0;

  let matches = 0;
  reports.forEach(report => {
    const forecast = apiForecasts.find(f => f.city.toLowerCase() === report.city.toLowerCase());
    if (forecast) {
      // Simple match check: does condition string appear in forecast description?
      if (forecast.condition.toLowerCase().includes(report.condition.toLowerCase())) {
        matches++;
      }
    }
  });

  return ((matches / reports.length) * 100).toFixed(1); // percentage
}

function displayAccuracy(apiForecasts) {
  const reports = JSON.parse(localStorage.getItem("weatherReports")) || [];
  const accuracy = calculateAccuracy(apiForecasts, reports);

  const accuracyCard = document.getElementById("accuracyCard");
  if (accuracyCard) {
    accuracyCard.textContent = `📊 Forecast Accuracy: ${accuracy}% based on community reports`;
  }
}
