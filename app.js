import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuDknEG8pjbT0_yaEDZ77IFYdGYrtwCIE",
  authDomain: "red-cross-baguio-tti-monitor.firebaseapp.com",
  projectId: "red-cross-baguio-tti-monitor",
  storageBucket: "red-cross-baguio-tti-monitor.firebasestorage.app",
  messagingSenderId: "361015244463",
  appId: "1:361015244463:web:076f8802942ca904f5065a"
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
  loginMsg.textContent = "Trying to log in...";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    loginMsg.textContent = "Enter email and password.";
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    loginMsg.textContent = "Login successful.";
    console.log("Login success:", result.user.email);
  } catch (error) {
    console.error(error);
    loginMsg.textContent = error.code + ": " + error.message;
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

onAuthStateChanged(auth, (user) => {
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
