// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Optional

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVv58KXJQvqnZS00AEw8mkiIOG63wSSCA",
    authDomain: "ai-ap-calorie.firebaseapp.com",
    databaseURL: "https://ai-ap-calorie-default-rtdb.firebaseio.com",
    projectId: "ai-ap-calorie",
    storageBucket: "ai-ap-calorie.firebasestorage.app",
    messagingSenderId: "420816214668",
    appId: "1:420816214668:web:56aa7f6704837af63eb9a9",
    measurementId: "G-GHJK5GJR5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
// These are required for the app to function
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);

export default app;
