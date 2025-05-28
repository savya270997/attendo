// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1Lv41c61SAMTwUYYIHR4rv2_4u8V-1h4",
  authDomain: "attendo-371e7.firebaseapp.com",
  projectId: "attendo-371e7",
  storageBucket: "attendo-371e7.firebasestorage.app",
  messagingSenderId: "297614525773",
  appId: "1:297614525773:web:262c55104ab6435c22e304",
  measurementId: "G-PXFGP19M7X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
