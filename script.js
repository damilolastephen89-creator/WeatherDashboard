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

// Clear history button event
document.getElementById("clear-history").addEventListener("click", clearHistory);

// Fetch current weather by city
function getWeatherByCity(city) {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url).then(res => res.json()).then(data => displayCurrentWeather(data));
}

// Fetch forecast by city
function getForecastByCity(city) {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url).then(res => res.json()).then(data => displayForecast(data));
}

// Fetch alerts
function getWeatherAlerts(lat, lon) {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url).then(res => res.json()).then(data => {
    if (data.alerts && data.alerts.length > 0) {
      displayAlerts(data.alerts);
    }
  });
}

// Display alerts
function displayAlerts(alerts) {
  const alertContainer = document.getElementById("alerts");
  alertContainer.innerHTML = "";
  alerts.forEach(alert => {
    const alertBox = document.createElement("div");
    alertBox.classList.add("alert-box");
    alertBox.innerHTML = `
      <button class="close-btn">❌</button>
      <h3>${alert.event}</h3>
      <p><em>From:</em> ${new Date(alert.start * 1000).toLocaleString()}</p>
      <p><em>Until:</em> ${new Date(alert.end * 1000).toLocaleString()}</p>
      <p>${alert.description}</p>
    `;
    alertContainer.appendChild(alertBox);
  });

  // Attach close button logic
  document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', function() {
      const alertBox = this.parentElement;
      const alertTitle = alertBox.querySelector('h3').innerText;
      alertBox.classList.add('fade-out');
      setTimeout(() => { alertBox.style.display = 'none'; }, 500);

      let dismissed = JSON.parse(localStorage.getItem('dismissedAlerts')) || [];
      if (!dismissed.includes(alertTitle)) {
        dismissed.push(alertTitle);
        localStorage.setItem('dismissedAlerts', JSON.stringify(dismissed));
      }
    });
  });
}

// Reset alerts
document.getElementById('reset-alerts').addEventListener('click', function() {
  localStorage.removeItem('dismissedAlerts');
  document.querySelectorAll('.alert-box').forEach(alertBox => {
    alertBox.style.display = 'block';
    alertBox.classList.remove('fade-out');
  });
});

// Countdown + auto-refresh
let refreshInterval = 3600; // seconds
let countdown = refreshInterval;

function startCountdown() {
  const timerDisplay = document.getElementById("countdown");
  setInterval(() => {
    countdown--;
    let minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    timerDisplay.innerText = `Next refresh in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (countdown <= 0) countdown = refreshInterval;
  }, 1000);
}

function startAutoRefresh(lat, lon) {
  getWeatherAlerts(lat, lon);
  startCountdown();
  setInterval(() => {
    getWeatherAlerts(lat, lon);
    countdown = refreshInterval;
  }, refreshInterval * 1000);
}

// Geolocation init
window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCity("Lagos"); // fallback
      getForecastByCity("Lagos");
      startAutoRefresh(lat, lon);
    }, () => {
      getWeatherByCity("Lagos");
      getForecastByCity("Lagos");
    });
  }
};

// Search form
document.getElementById("search-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const city = document.getElementById("search-input").value;
  getWeatherByCity(city);
  getForecastByCity(city);
});

function startAutoRefresh(lat, lon) {
  getWeatherAlerts(lat, lon);
  startCountdown();

  setInterval(() => {
    console.log("Refreshing alerts...");
    getWeatherAlerts(lat, lon);
    countdown = refreshInterval;

    // Play sound
    const sound = document.getElementById("refresh-sound");
    if (sound) sound.play();

    // Vibrate (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]); // vibrate pattern
    }
  }, refreshInterval * 1000);
}

timerDisplay.classList.add("flash");
setTimeout(() => timerDisplay.classList.remove("flash"), 1000);
