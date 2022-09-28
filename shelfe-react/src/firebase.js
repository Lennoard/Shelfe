import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyARH389Ua50d3vrI6ypvLWPUhW-OeNZ2U8",
  authDomain: "shelfe-app.firebaseapp.com",
  projectId: "shelfe-app",
  storageBucket: "shelfe-app.appspot.com",
  messagingSenderId: "475581171423",
  appId: "1:475581171423:web:c8c2143887501357dfcb6a"
};

export default function initFirebase() {
  initializeApp(firebaseConfig);
}