const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client("62023891881-8pcolavqedtnqmpicjf8uch6tooqs1ui.apps.googleusercontent.com");

// Verify JWT endpoint
app.post("/verify-token", async (req, res) => {
  const token = req.body.id_token;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID", // must match your frontend client_id
    });
    const payload = ticket.getPayload();
    res.json({ success: true, user: payload });
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
