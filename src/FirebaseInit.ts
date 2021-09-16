import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARH389Ua50d3vrI6ypvLWPUhW-OeNZ2U8",
  authDomain: "shelfe-app.firebaseapp.com",
  projectId: "shelfe-app",
  storageBucket: "shelfe-app.appspot.com",
  messagingSenderId: "475581171423",
  appId: "1:475581171423:web:c8c2143887501357dfcb6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);