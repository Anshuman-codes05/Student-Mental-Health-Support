// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpKXNIhD_VU4lQK76Y08pxwyYMs7sjQBo",
  authDomain: "dmhs-balanced.firebaseapp.com",
  projectId: "dmhs-balanced",
  storageBucket: "dmhs-balanced.firebasestorage.app",
  messagingSenderId: "78917830324",
  appId: "1:78917830324:web:5623d53147c1e68b2af9e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth

// Export Firestore database and Auth
export { db, auth };