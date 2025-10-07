/* eslint-env serviceworker */
/* eslint-disable no-undef */

// Use Firebase compat scripts
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDc47Hg0bmU84MEd8seniZ2Jyd-euAPbLs",
  authDomain: "pwa-test-c9487.firebaseapp.com",
  projectId: "pwa-test-c9487",
  storageBucket: "pwa-test-c9487.firebasestorage.app",
  messagingSenderId: "797213926197",
  appId: "1:797213926197:web:f6c67ceccaca57c0c7a27c",
});

const messaging = firebase.messaging();

// Background messages
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const title =
    payload.notification?.title || payload.data?.title || "Notification";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/favicon.svg",
  };

  self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data?.url) {
    clients.openWindow(event.notification.data.url);
  }
});
