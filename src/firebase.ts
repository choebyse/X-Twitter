import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
