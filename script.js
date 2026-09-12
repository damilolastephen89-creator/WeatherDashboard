function displayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // clear old forecast

  // Loop through next 5 days
  for (let i = 0; i < 5; i++) {
    const day = forecastData.list[i * 8]; // API gives data every 3 hours, so 8 = 24h
    const date = new Date(day.dt_txt).toLocaleDateString();

    // Create forecast card
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <h4>${date}</h4>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
      <p>Temp: ${day.main.temp}°C</p>
      <p>Humidity: ${day.main.humidity}%</p>
      <p>Wind: ${day.wind.speed} m/s</p>
    `;

    forecastContainer.appendChild(card);
  }
}

