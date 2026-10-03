// === PROJETO ASTER – Configuração do Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUi483K7vRuzFW8pKJdxp7K5j7pqTWfrA",
  authDomain: "aster-9adab.firebaseapp.com",
  projectId: "aster-9adab",
  storageBucket: "aster-9adab.firebasestorage.app",
  messagingSenderId: "417158310114",
  appId: "1:417158310114:web:5ba34f5a4b99d7bcfe96bb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
