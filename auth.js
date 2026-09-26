function initAuth() {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const user = document.getElementById("username").value;
    localStorage.setItem("currentUser", user);
    document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
  });
}

62023891881-8pcolavqedtnqmpicjf8uch6tooqs1ui.apps.googleusercontent.com
