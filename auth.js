function initAuth() {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const user = document.getElementById("username").value;
    localStorage.setItem("currentUser", user);
    document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
  });
}
