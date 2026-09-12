// Fetch weather data
function fetchWeather(city) {
  const apiKey = "YOUR_API_KEY"; // replace with your OpenWeather API key
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Display current weather
      document.getElementById("current-weather").innerHTML = `
        <h3>${data.city.name}</h3>
        <p>Temp: ${data.list[0].main.temp}°C</p>
        <p>Humidity: ${data.list[0].main.humidity}%</p>
        <p>Wind: ${data.list[0].wind.speed} m/s</p>
      `;
      // Display forecast
      displayForecast(data);
    })
    .catch(() => {
      document.getElementById("current-weather").innerHTML = `<p>City not found. Try again.</p>`;
    });
}

// Display 5-day forecast
function displayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const day = forecastData.list[i * 8]; // 8 intervals = 24h
    const date = new Date(day.dt_txt).toLocaleDateString();

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

// Save search to localStorage
function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    renderSearchHistory();
  }
}

// Render search history
function renderSearchHistory() {
  const historyList = document.getElementById("search-history");
  historyList.innerHTML = "";

  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      fetchWeather(city);
    });
    historyList.appendChild(li);
  });
}

// Clear history
function clearHistory() {
  localStorage.removeItem("searchHistory");
  renderSearchHistory();
}

// Search button event
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    fetchWeather(city);
    saveSearch(city);
  }
});

// Load history on page start
renderSearchHistory();

