import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// REPLACE THESE WITH YOUR REAL FIREBASE VALUES
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMsg = document.getElementById("loginMsg");

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const userEmail = document.getElementById("userEmail");

console.log("app.js loaded");
console.log("loginBtn found:", !!loginBtn);

loginBtn.addEventListener("click", async () => {
  console.log("Login button clicked");
  loginMsg.textContent = "Trying to log in...";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    loginMsg.textContent = "Enter email and password.";
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login success:", result.user.email);
    loginMsg.textContent = "Login successful.";
  } catch (error) {
    console.error("Login error:", error);
    loginMsg.textContent = `${error.code}: ${error.message}`;
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
});

onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed:", user ? user.email : "No user");

  if (user) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    userEmail.textContent = user.email;
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    userEmail.textContent = "";
  }
});
