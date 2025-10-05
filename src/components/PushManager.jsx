import { useState } from "react";

const PUBLIC_VAPID_KEY =
  "BMHeikDEHP9kLglXCqPv-nnptecq2Gtu6w5FG2_i-rMMkHD8UxuwSY6kP9i3K-O-pX3b_NMGEPmSAwPftRSrzlw";

export default function PushManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  async function subscribe() {
    // Step 1: Ask user permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied ❌");
      return;
    }

    // Step 2: Wait until service worker is ready
    const registration = await navigator.serviceWorker.ready;

    // Step 3: Subscribe user
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // Step 4: Save subscription to backend
    await fetch("http://localhost:3000/api/save-subscription", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });

    setIsSubscribed(true);
  }

  return (
    <button className="!bg-blue-500 text-2xl" onClick={subscribe} disabled={isSubscribed}>
      {isSubscribed ? "✅ Notifications Enabled" : "🔔 Enable Notifications"}
    </button>
  );
}

// helper
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
