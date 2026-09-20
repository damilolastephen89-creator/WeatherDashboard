console.log("Injected API Key:", process.env.NEXT_PUBLIC_WEATHER_API_KEY);

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

// Use your Vercel env variable: NEXT_PUBLIC_WEATHER_API_KEY
const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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

      forecastHTML += "</div>";
      document.getElementById("forecast").innerHTML += forecastHTML;
    }
  } catch (error) {
    document.getElementById("forecast").innerHTML += `<p>Error fetching forecast.</p>`;
  }
}
