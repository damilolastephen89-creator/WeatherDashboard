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

  // Choose icon based on type + theme
  let icon = "";
  if (type === "success") icon = "✅";
  else if (type === "error") icon = "❌";
  else if (type === "warning") icon = "⚠️";
  else if (type === "info") {
    icon = document.body.classList.contains("dark-theme") ? "🌙" : "🌞";
  }

  // Toast content wrapper
  const content = document.createElement("span");
  content.textContent = `${icon} ${message}`;

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.className = "toast-close";
  closeBtn.addEventListener("click", () => toast.remove());

  toast.appendChild(content);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Auto remove only if not persistent
  if (!persistent) {
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4000);
  }
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

// Combined parallax effect with inertia (scroll + mouse)
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

  // Smoothly interpolate mouse position (inertia)
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  // Stars (far background)
  document.querySelectorAll(".star").forEach(star => {
    star.style.transform = `translate(${mouseX * 10}px, ${scrollY * starSpeed + mouseY * 10}px)`;
  });

  // Clouds (mid layer)
  document.querySelectorAll(".cloud").forEach(cloud => {
    cloud.style.transform = `translate(${mouseX * 20}px, ${scrollY * cloudSpeed + mouseY * 15}px)`;
  });

  // Horizon (foreground base)
  const horizon = document.getElementById("horizon");
  if (horizon) {
    horizon.style.transform = `translate(${mouseX * 5}px, ${scrollY * horizonSpeed + mouseY * 3}px)`;
  }
});

// Reset parallax button
document.getElementById("reset-parallax").addEventListener("click", function() {
  // Reset mouse offsets
  mouseX = 0;
  mouseY = 0;
  targetX = 0;
  targetY = 0;

  // Reset transforms
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

  // Toast confirmation
  showToast("🎯 Parallax reset to center", "info");
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
   - Theme aware
   - Stacking
   - Icons
   - Slide-in animation
   - Close button
   - Persistent option
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

  toast.appendChild(content);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Auto remove if not persistent
  if (!persistent) {
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4000);
  }
}
