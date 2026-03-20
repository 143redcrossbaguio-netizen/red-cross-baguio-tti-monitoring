import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// PASTE YOUR REAL FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LOGIN ELEMENTS
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

// DATA INPUT ELEMENTS
const donorName = document.getElementById("donorName");
const donorId = document.getElementById("donorId");
const date = document.getElementById("date");
const hiv = document.getElementById("hiv");
const hbsag = document.getElementById("hbsag");
const hcv = document.getElementById("hcv");
const syphilis = document.getElementById("syphilis");
const malaria = document.getElementById("malaria");
const remarks = document.getElementById("remarks");
const saveBtn = document.getElementById("saveBtn");
const saveMsg = document.getElementById("saveMsg");

// LOGIN
loginBtn.addEventListener("click", async () => {
  loginMsg.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (error) {
    loginMsg.textContent = error.message;
  }
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// AUTH STATE
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    userEmail.textContent = user.email;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      masterPanel.classList.add("hidden");
      memberPanel.classList.add("hidden");

      if (userSnap.exists()) {
        const data = userSnap.data();
        userRole.textContent = data.role || "unknown";

        if (data.role === "master") {
          masterPanel.classList.remove("hidden");
        } else if (data.role === "member") {
          memberPanel.classList.remove("hidden");
        }
      } else {
        userRole.textContent = "no role assigned";
      }
    } catch (error) {
      userRole.textContent = "error loading role";
      console.error(error);
    }
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    masterPanel.classList.add("hidden");
    memberPanel.classList.add("hidden");
  }
});

// SAVE DATA INPUT
saveBtn.addEventListener("click", async () => {
  saveMsg.textContent = "";

  const user = auth.currentUser;
  if (!user) {
    saveMsg.textContent = "Please log in first.";
    return;
  }

  if (
    donorName.value.trim() === "" ||
    donorId.value.trim() === "" ||
    date.value === "" ||
    hiv.value === "" ||
    hbsag.value === "" ||
    hcv.value === "" ||
    syphilis.value === "" ||
    malaria.value === ""
  ) {
    saveMsg.textContent = "Please complete all required fields.";
    return;
  }

  try {
    await addDoc(collection(db, "tti_records"), {
      donorName: donorName.value.trim(),
      donorId: donorId.value.trim(),
      date: date.value,
      hiv: hiv.value,
      hbsag: hbsag.value,
      hcv: hcv.value,
      syphilis: syphilis.value,
      malaria: malaria.value,
      remarks: remarks.value.trim(),
      createdBy: user.email,
      createdByUid: user.uid,
      createdAt: serverTimestamp()
    });

    saveMsg.textContent = "Record saved successfully.";

    donorName.value = "";
    donorId.value = "";
    date.value = "";
    hiv.value = "";
    hbsag.value = "";
    hcv.value = "";
    syphilis.value = "";
    malaria.value = "";
    remarks.value = "";
  } catch (error) {
    console.error(error);
    saveMsg.textContent = "Error saving record: " + error.message;
  }
});
