// Sidebar open/close
document.getElementById("open-settings").addEventListener("click", function() {
  document.getElementById("settings-sidebar").classList.add("open");
});

document.getElementById("close-settings").addEventListener("click", function() {
  document.getElementById("settings-sidebar").classList.remove("open");
});

// Tab switching
document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", function() {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.getElementById(this.dataset.tab).classList.add("active");
  });
});

// Reset button + animation + toast
document.getElementById("reset-settings").addEventListener("click", function() {
  localStorage.clear();
  document.getElementById("settings-sidebar").classList.add("reset-animate");
  setTimeout(() => {
    document.getElementById("settings-sidebar").classList.remove("reset-animate");
  }, 1200);
  showToast("✔️ Settings reset successfully", "success");
});

// Toast function
function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "";
  toast.classList.add("show", type);
  setTimeout(() => {
    toast.classList.remove("show", type);
  }, 3000);
}

// Theme handling
function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    document.getElementById("horizon").style.opacity = "0.7";
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    document.getElementById("horizon").style.opacity = "1";
  }
}

// Stars
function generateStars(count = 50) {
  document.querySelectorAll(".star").forEach(star => star.remove());
  if (document.body.classList.contains("dark-theme")) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.top = Math.random() * window.innerHeight + "px";
      star.style.left = Math.random() * window.innerWidth + "px";
      star.style.animationDuration = (1 + Math.random() * 2) + "s";
      document.body.appendChild(star);
    }
  }
}

// Clouds
function generateClouds(count = 5) {
  document.querySelectorAll(".cloud").forEach(cloud => cloud.remove());
  if (document.body.classList.contains("light-theme")) {
    for (let i = 0; i < count; i++) {
      const cloud = document.createElement("div");
      cloud.classList.add("cloud");
      cloud.style.top = Math.random() * (window.innerHeight / 2) + "px";
      cloud.style.left = -150 + "px";
      cloud.style.animationDuration = (40 + Math.random() * 40) + "s";
      document.body.appendChild(cloud);
    }
  }
}

// Theme change listener with sunrise/sunset transitions
document.getElementById("theme-select").addEventListener("change", function() {
  const selectedTheme = this.value;
  localStorage.setItem("theme", selectedTheme);

  document.body.classList.remove("sunrise", "sunset");

  if (selectedTheme === "dark") {
    document.body.classList.add("sunset");
    setTimeout(() => {
      applyTheme("dark");
      generateStars();
    }, 2000);
    showToast("🌑 Sunset into Dark mode", "info");
  } else {
    document.body.classList.add("sunrise");
    setTimeout(() => {
      applyTheme("light");
      generateClouds();
    }, 2000);
    showToast("☀️ Sunrise into Light mode", "info");
  }

  const themeIcon = document.getElementById("theme-icon");
  themeIcon.textContent = selectedTheme === "dark" ? "🌑" : "☀️";
  themeIcon.classList.add("animate");
  setTimeout(() => themeIcon.classList.remove("animate"), 800);
});

// Load saved theme on startup
window.onload = function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
    document.getElementById("theme-select").value = savedTheme;
    if (savedTheme === "dark") {
      generateStars();
    } else {
      generateClouds();
    }
  }
};

// Parallax effect on scroll
window.addEventListener("scroll", function() {
  const scrollY = window.scrollY;

  // Stars move slower (far background)
  document.querySelectorAll(".star").forEach(star => {
    star.style.transform = `translateY(${scrollY * 0.2}px)`;
  });

  // Clouds move a bit faster (mid layer)
  document.querySelectorAll(".cloud").forEach(cloud => {
    cloud.style.transform = `translateY(${scrollY * 0.4}px)`;
  });

  // Horizon moves slightly (foreground base)
  const horizon = document.getElementById("horizon");
  if (horizon) {
    horizon.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
});
