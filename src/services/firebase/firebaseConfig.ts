// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // kalau pakai Firestore
import { getAuth } from "firebase/auth"; // kalau pakai Auth
import { getStorage } from "firebase/storage"; // kalau pakai Auth

const firebaseConfig = {
  apiKey: "AIzaSyAqmQaAsUU8DqoAiDRJ3G2NI3jynjyjTjE",
  authDomain: "roommart-35e5e.firebaseapp.com",
  projectId: "roommart-35e5e",
  storageBucket: "roommart-35e5e.firebasestorage.app",
  messagingSenderId: "307186536050",
  appId: "1:307186536050:web:78e4d4fdc14d9a0e20bceb",
  measurementId: "G-VSR30GP76T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Auth
const storage = getStorage(app);

export { db, auth, analytics, storage };
