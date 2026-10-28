// ================================
// WEATHER DASHBOARD SCRIPT
// ================================

const apiKey = "YOUR_OPENWEATHER_API_KEY";

// ================================
// WEATHER
// ================================

async function fetchWeather(city) {
  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const data = await response.json();

    renderCurrentWeather(data.current);
    renderForecast(data.forecast);

  } catch (error) {
    console.error("Weather Error:", error);
    showToast("Unable to fetch weather data", "error");
  }
}

function renderCurrentWeather(weather) {

  const cityName = document.getElementById("cityName");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");
  const icon = document.getElementById("icon");

  if (!weather) return;

  cityName.textContent = weather.name;

  temperature.textContent =
    `${Math.round(weather.main.temp)}°C`;

  description.textContent =
    weather.weather[0].description;

  if (icon) {
    icon.src =
      `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  }
}

function renderForecast(forecast) {

  const container =
    document.getElementById("forecast");

  if (!container || !forecast?.list) return;

  container.innerHTML = "";

  forecast.list
    .slice(0, 5)
    .forEach((item, index) => {

      const card =
        document.createElement("div");

      card.className = "forecast-card";

      card.style.animationDelay =
        `${index * 0.15}s`;

      card.innerHTML = `
        <p>${new Date(item.dt_txt).toLocaleString()}</p>
        <p>${item.main.temp}°C</p>
        <p>${item.weather[0].description}</p>
      `;

      card.addEventListener("click", () => {
        openWeatherModal(item);
      });

      container.appendChild(card);
    });
}

// ================================
// SEARCH
// ================================

function searchCity() {

  const input =
    document.getElementById("cityInput");

  if (!input) return;

  const city = input.value.trim();

  if (!city) {
    showToast("Please enter a city", "warning");
    return;
  }

  fetchWeather(city);
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const searchBtn =
      document.getElementById("searchBtn");

    if (searchBtn) {
      searchBtn.addEventListener(
        "click",
        searchCity
      );
    }

    fetchWeather("Lagos");
  }
);

// ================================
// TOASTS
// ================================

function showToast(
  message,
  type = "info"
) {

  let container =
    document.querySelector(
      ".toast-container"
    );

  if (!container) {

    container =
      document.createElement("div");

    container.className =
      "toast-container";

    document.body.appendChild(
      container
    );
  }

  const toast =
    document.createElement("div");

  toast.className =
    `toast toast-${type}`;

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ================================
// THEME
// ================================

function initializeTheme() {

  const themeToggle =
    document.getElementById(
      "themeToggle"
    );

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "dark") {

    document.body.classList.add(
      "dark-mode"
    );

    if (themeToggle) {
      themeToggle.checked = true;
    }
  }

  if (themeToggle) {

    themeToggle.addEventListener(
      "change",
      () => {

        document.body.classList.toggle(
          "dark-mode",
          themeToggle.checked
        );

        localStorage.setItem(
          "theme",
          themeToggle.checked
            ? "dark"
            : "light"
        );
      }
    );
  }
}

// ================================
// FAVORITES
// ================================

function saveFavorite(city) {

  let favorites =
    JSON.parse(
      localStorage.getItem(
        "favorites"
      )
    ) || [];

  if (!favorites.includes(city)) {

    favorites.push(city);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }
}

// ================================
// WEATHER MODAL
// ================================

function openWeatherModal(item) {

  const modal =
    document.getElementById(
      "weatherModal"
    );

  if (!modal) return;

  document.getElementById(
    "modalDate"
  ).textContent =
    new Date(
      item.dt_txt
    ).toLocaleString();

  document.getElementById(
    "modalTemp"
  ).textContent =
    `Temperature: ${item.main.temp}°C`;

  document.getElementById(
    "modalDescription"
  ).textContent =
    item.weather[0].description;

  modal.classList.add("show");
}

function initializeModal() {

  const modal =
    document.getElementById(
      "weatherModal"
    );

  const closeBtn =
    document.querySelector(
      ".close"
    );

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener(
    "click",
    () => {
      modal.classList.remove(
        "show"
      );
    }
  );

  window.addEventListener(
    "click",
    e => {

      if (e.target === modal) {

        modal.classList.remove(
          "show"
        );
      }
    }
  );
}

// ================================
// RIPPLE EFFECT
// ================================

function initializeRipples() {

  document.addEventListener(
    "click",
    e => {

      const card =
        e.target.closest(
          ".forecast-card"
        );

      if (!card) return;

      const circle =
        document.createElement(
          "span"
        );

      circle.className =
        "ripple";

      card.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    }
  );
}

// ================================
// STARTUP
// ================================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeTheme();

    initializeModal();

    initializeRipples();
  }
);
