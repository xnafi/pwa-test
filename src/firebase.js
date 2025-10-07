// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDc47Hg0bmU84MEd8seniZ2Jyd-euAPbLs",
  authDomain: "pwa-test-c9487.firebaseapp.com",
  projectId: "pwa-test-c9487",
  storageBucket: "pwa-test-c9487.firebasestorage.app",
  messagingSenderId: "797213926197",
  appId: "1:797213926197:web:f6c67ceccaca57c0c7a27c",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
