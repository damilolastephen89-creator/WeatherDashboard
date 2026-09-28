function initAuth() {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const user = document.getElementById("username").value;
    localStorage.setItem("currentUser", user);
    document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
  });
}

function initGoogleAuth() {
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      redirect_uri: "https://weather-dashboard-omega-peach.vercel.app/auth/google/callback"
    }).then(function(auth2) {
      auth2.signIn().then(function(googleUser) {
        const profile = googleUser.getBasicProfile();
        const user = profile.getEmail();
        localStorage.setItem("currentUser", user);
        document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
        document.getElementById("loginSection").style.display = "none";
      });
    });
  });
}


function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  const user = data.email;
  localStorage.setItem("currentUser", user);
  document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
  document.getElementById("loginSection").style.display = "none";
}

function initMicrosoftAuth() {
  const msalConfig = {
    auth: {
      clientId: "795b3c76-4e95-46da-86a8-e6978c35b756",
      authority: "https://login.microsoftonline.com/27869747-32c9-443f-9917-4bdca06881bf",
      redirectUri: "https://weather-dashboard-omega-peach.vercel.app/auth/microsoft/callback"
    }
  };

  const msalInstance = new msal.PublicClientApplication(msalConfig);

  msalInstance.loginPopup({
    scopes: ["user.read"]
  }).then(response => {
    const user = response.account.username;
    localStorage.setItem("currentUser", user);
    document.getElementById("userProfile").innerText = `Welcome, ${user}!`;
    document.getElementById("loginSection").style.display = "none";
  }).catch(error => {
    console.error(error);
  });
}
