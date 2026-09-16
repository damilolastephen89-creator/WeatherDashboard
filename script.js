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

