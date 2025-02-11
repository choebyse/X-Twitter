// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRcMpSBPt27zT36AleCZ5HnCqxv9cvyX4",
  authDomain: "x-twitter-97bed.firebaseapp.com",
  projectId: "x-twitter-97bed",
  storageBucket: "x-twitter-97bed.firebasestorage.app",
  messagingSenderId: "175244333387",
  appId: "1:175244333387:web:100eee0e0ff5e62cc7d8ce",
  measurementId: "G-MB6E0KVG21",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
