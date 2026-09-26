function initAuth() {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const user = document.getElementById("username").value;
    localStorage.setItem("currentUser", user);
    document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
  });
}

62023891881-8pcolavqedtnqmpicjf8uch6tooqs1ui.apps.googleusercontent.com

function initGoogleAuth() {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("googleLogin"),
    { theme: "outline", size: "large" }
  );
}

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  const user = data.email;
  localStorage.setItem("currentUser", user);
  document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
  document.getElementById("loginSection").style.display = "none";
}
