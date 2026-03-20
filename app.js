import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// PASTE YOUR REAL FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "PASTE_REAL_API_KEY",
  authDomain: "PASTE_REAL_AUTH_DOMAIN",
  projectId: "PASTE_REAL_PROJECT_ID",
  storageBucket: "PASTE_REAL_STORAGE_BUCKET",
  messagingSenderId: "PASTE_REAL_MESSAGING_SENDER_ID",
  appId: "PASTE_REAL_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMsg = document.getElementById("loginMsg");

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const userEmail = document.getElementById("userEmail");
const userRole = document.getElementById("userRole");
const masterPanel = document.getElementById("masterPanel");
const memberPanel = document.getElementById("memberPanel");

// LOGIN
loginBtn.addEventListener("click", async () => {
  loginMsg.textContent = "Logging in...";

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );

    loginMsg.textContent = "Login successful";
    console.log("Logged in user:", result.user);
  } catch (error) {
    console.error("Login error:", error);
    loginMsg.textContent = error.code + " : " + error.message;
  }
});

// LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

// AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginSection) loginSection.classList.add("hidden");
    if (dashboardSection) dashboardSection.classList.remove("hidden");

    if (userEmail) userEmail.textContent = user.email;
    if (userRole) userRole.textContent = "logged in";

    if (masterPanel) masterPanel.classList.add("hidden");
    if (memberPanel) memberPanel.classList.add("hidden");
  } else {
    if (loginSection) loginSection.classList.remove("hidden");
    if (dashboardSection) dashboardSection.classList.add("hidden");
  }
});
