// Define the function at the top
async function getWeather(city) {
  try {
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();
    console.log("Weather data:", data); // test output
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Hook into your search button
document.querySelector("#searchBtn").addEventListener("click", () => {
  const city = document.querySelector("#cityInput").value;
  getWeather(city).then(data => {
    if (data) {
      // Update city name
      document.querySelector("#cityName").textContent = data.city.name;

      // Update current temperature
      document.querySelector("#temperature").textContent =
        data.list[0].main.temp + "°C";

      // Update forecast cards
      const forecastContainer = document.querySelector("#forecast");
      forecastContainer.innerHTML = ""; // clear old forecast

      data.list.slice(0, 5).forEach(item => {
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
          <p>${new Date(item.dt_txt).toLocaleString()}</p>
          <p>${item.main.temp}°C</p>
          <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(card);
      });
    }
  });
});

// Optional: load default city on page load
window.addEventListener("DOMContentLoaded", () => {
  getWeather("Lagos").then(data => {
    if (data) {
      document.querySelector("#cityName").textContent = data.city.name;
      document.querySelector("#temperature").textContent =
        data.list[0].main.temp + "°C";
    }
  });
});


/* ===========================
   Parallax with Inertia
   =========================== */
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

window.addEventListener("mousemove", function(e) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  targetX = (e.clientX - centerX) / centerX;
  targetY = (e.clientY - centerY) / centerY;
});

window.addEventListener("scroll", function() {
  const scrollY = window.scrollY;
  const isMobile = window.innerWidth < 768;

  const starSpeed = isMobile ? 0.1 : 0.2;
  const cloudSpeed = isMobile ? 0.2 : 0.4;
  const horizonSpeed = isMobile ? 0.05 : 0.1;

  // Smooth inertia
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // Stars
  document.querySelectorAll(".star").forEach(star => {
    star.style.transform = `translate(${mouseX * 10}px, ${scrollY * starSpeed + mouseY * 10}px)`;
  });

  // Clouds
  document.querySelectorAll(".cloud").forEach(cloud => {
    cloud.style.transform = `translate(${mouseX * 20}px, ${scrollY * cloudSpeed + mouseY * 15}px)`;
  });

  // Horizon
  const horizon = document.getElementById("horizon");
  if (horizon) {
    horizon.style.transform = `translate(${mouseX * 5}px, ${scrollY * horizonSpeed + mouseY * 3}px)`;
  }
});

/* ===========================
   Reset Parallax Button
   =========================== */
document.getElementById("reset-parallax").addEventListener("click", function() {
  mouseX = 0;
  mouseY = 0;
  targetX = 0;
  targetY = 0;

  document.querySelectorAll(".star").forEach(star => {
    star.style.transform = "translate(0, 0)";
  });

  document.querySelectorAll(".cloud").forEach(cloud => {
    cloud.style.transform = "translate(0, 0)";
  });

  const horizon = document.getElementById("horizon");
  if (horizon) {
    horizon.style.transform = "translate(0, 0)";
  }

  showToast("🎯 Parallax reset to center", "info");
});

/* ===========================
   Toast Notifications
   =========================== */
function showToast(message, type = "info", persistent = false) {
  // Ensure container exists
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";

  // Icon logic
  let icon = "";
  if (type === "success") icon = "✅";
  else if (type === "error") icon = "❌";
  else if (type === "warning") icon = "⚠️";
  else if (type === "info") {
    icon = document.body.classList.contains("dark-theme") ? "🌙" : "🌞";
  }

  // Content
  const content = document.createElement("span");
  content.textContent = `${icon} ${message}`;

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.className = "toast-close";
  closeBtn.addEventListener("click", () => toast.remove());

  // Progress bar
  const progress = document.createElement("div");
  progress.className = "toast-progress";

  toast.appendChild(content);
  toast.appendChild(closeBtn);
  toast.appendChild(progress);
  container.appendChild(toast);

  // Auto remove if not persistent
  if (!persistent) {
    let duration = 4000; // 4 seconds
    progress.style.animation = `progressBar ${duration}ms linear forwards`;

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, duration);
  }
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      document.getElementById("forecast").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp} °C</p>
        <p>☁️ Weather: ${data.weather[0].description}</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
      `;
    } else {
      document.getElementById("forecast").innerHTML = `<p>City not found!</p>`;
    }
  } catch (error) {
    document.getElementById("forecast").innerHTML = `<p>Error fetching data.</p>`;
  }
}

async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === "200") {
      let forecastHTML = "<h3>5‑Day Forecast</h3><div class='forecast-grid'>";
      const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      daily.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const iconCode = day.weather[0].icon; // e.g. "04d"
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        forecastHTML += `
          <div class="forecast-card">
            <h4>${date}</h4>
            <img src="${iconUrl}" alt="${day.weather[0].description}">
            <p>🌡️ Temp: ${day.main.temp} °C</p>
            <p>☁️ ${day.weather[0].description}</p>
            <p>💨 Wind: ${day.wind.speed} m/s</p>
          </div>
        `;
      });

  const forecastContainer = document.querySelector("#forecast");
forecastContainer.innerHTML = ""; // clear old forecast

// Group forecasts by date
const dailyForecasts = {};
data.list.forEach(item => {
  const date = new Date(item.dt_txt).toLocaleDateString();
  if (!dailyForecasts[date]) {
    dailyForecasts[date] = [];
  }
  dailyForecasts[date].push(item);
});

// Show 5 days max
Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
  const items = dailyForecasts[date];

  // Calculate average, min, and max temperatures
  const temps = items.map(entry => entry.main.temp);
  const avgTemp = temps.reduce((sum, t) => sum + t, 0) / temps.length;
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  
// Calculate gradient based on avgTemp
let gradient;
if (avgTemp <= 15) {
  // Cold day
  gradient = "linear-gradient(135deg, #bbdefb, #2196f3)"; // cool blue
} else if (avgTemp > 15 && avgTemp <= 25) {
  // Mild day
  gradient = "linear-gradient(135deg, #c8e6c9, #4caf50)"; // greenish
} else if (avgTemp > 25 && avgTemp <= 35) {
  // Warm day
  gradient = "linear-gradient(135deg, #fff9c4, #fdd835)"; // yellow
} else {
  // Hot day
  gradient = "linear-gradient(135deg, #ffccbc, #e53935)"; // orange-red
}

// Build card
const card = document.createElement("div");
card.className = "forecast-card";
card.style.background = gradient;
card.innerHTML = `
  <p>${date}</p>
  <img src="${iconUrl}" alt="${firstEntry.weather[0].description}" />
  <p>Avg: ${avgTemp.toFixed(1)}°C</p>
  <p class="temp-range">
    ❄️ Min: <span class="min">${minTemp.toFixed(1)}°C</span> | 
    🔥 Max: <span class="max">${maxTemp.toFixed(1)}°C</span>
  </p>
  <p>${firstEntry.weather[0].description}</p>
`;
forecastContainer.appendChild(card);

  // Fade-in effect for sticky legend
window.addEventListener("scroll", () => {
  const legend = document.getElementById("legend");
  if (window.scrollY > 50) {
    legend.classList.add("sticky-visible");
  } else {
    legend.classList.remove("sticky-visible");
  }
});

  // Use the first entry’s weather description/icon for the day
  const firstEntry = items[0];
  let theme = "cloudy"; // default
  const description = firstEntry.weather[0].main.toLowerCase();
  if (description.includes("clear")) theme = "sunny";
  else if (description.includes("rain")) theme = "rainy";
  else if (description.includes("storm")) theme = "stormy";

  const iconCode = firstEntry.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Build card
  const card = document.createElement("div");
 card.className = `forecast-card ${theme}`;
card.innerHTML = `
  <p>${date}</p>
  <img src="${iconUrl}" alt="${firstEntry.weather[0].description}" />
  <p>Avg: ${avgTemp.toFixed(1)}°C</p>
  <p class="temp-range">
    ❄️ Min: <span class="min">${minTemp.toFixed(1)}°C</span> | 
    🔥 Max: <span class="max">${maxTemp.toFixed(1)}°C</span>
  </p>
  <p>${firstEntry.weather[0].description}</p>
`;

document.querySelectorAll('.legend').forEach(item => {
  item.addEventListener('click', function(e) {
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = e.clientX - rect.left - size / 2 + 'px';
    circle.style.top = e.clientY - rect.top - size / 2 + 'px';
    this.appendChild(circle);

    // Remove ripple after animation
    setTimeout(() => {
      circle.remove();
    }, 600);
  });
});

// Preload sound
const clickSound = new Audio('sounds/waterdrop.mp3');
let soundEnabled = true;

// Toggle listener
document.getElementById('soundSwitch').addEventListener('change', function() {
  soundEnabled = this.checked;
});

// Ripple + sound effect
document.querySelectorAll('.legend').forEach(item => {
  item.addEventListener('click', function(e) {
    // Ripple effect
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = e.clientX - rect.left - size / 2 + 'px';
    circle.style.top = e.clientY - rect.top - size / 2 + 'px';
    this.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);

    // Play sound only if enabled
    if (soundEnabled) {
      clickSound.currentTime = 0;
      clickSound.play();
    }
  });
});

document.querySelectorAll('.forecast-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});
                                                
function setWeatherBackground(condition) {
  const bg = document.getElementById('background');
  bg.innerHTML = ''; // clear old

  if (condition.includes('Rain')) {
    for (let i = 0; i < 50; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.left = Math.random() * window.innerWidth + 'px';
      drop.style.animationDelay = Math.random() + 's';
      bg.appendChild(drop);
    }
  }
  // Add similar blocks for Snow, Clouds, Sun, etc.
}

document.getElementById('themeSwitch').addEventListener('change', e => {
  document.documentElement.setAttribute('data-theme', e.target.value);
});
  
// Theme switch
document.getElementById('themeSwitch').addEventListener('change', e => {
  document.documentElement.setAttribute('data-theme', e.target.value);
  localStorage.setItem('theme', e.target.value);
});

// Unit switch
let unit = localStorage.getItem('unit') || 'C';
document.getElementById('unitSwitch').value = unit;
document.getElementById('unitSwitch').addEventListener('change', e => {
  unit = e.target.value;
  localStorage.setItem('unit', unit);
  updateForecastDisplay(); // refresh cards
});

// Favorites
function saveFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

const ctx = document.getElementById('tempChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon','Tue','Wed','Thu','Fri'],
    datasets: [{
      label: 'Highs',
      data: [30, 32, 28, 29, 31],
      borderColor: 'red',
      fill: false
    },{
      label: 'Lows',
      data: [22, 21, 20, 19, 23],
      borderColor: 'blue',
      fill: false
    }]
  }
});

function shareForecast(text) {
  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Forecast copied to clipboard!");
  }
}

function downloadChart() {
  const link = document.createElement('a');
  link.href = tempChart.toBase64Image();
  link.download = 'temperature-trend.png';
  link.click();
}

function sendNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification(message);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(message);
      }
    });
  }
}
  
function clothingSuggestion(temp, condition) {
  if (condition.includes('Rain')) return "Bring an umbrella and wear a waterproof jacket.";
  if (temp > 30) return "Light clothing, sunglasses, and stay hydrated.";
  if (temp < 15) return "Wear a warm jacket and scarf.";
  return "Comfortable casual wear is fine.";
}

function awardBadge(badgeName) {
  let badges = JSON.parse(localStorage.getItem('badges')) || [];
  if (!badges.includes(badgeName)) {
    badges.push(badgeName);
    localStorage.setItem('badges', JSON.stringify(badges));
    alert(`You earned the ${badgeName} badge!`);
  }
}
                                                
