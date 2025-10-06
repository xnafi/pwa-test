import { useState, useEffect } from "react";

const PUBLIC_VAPID_KEY =
  "BMHeikDEHP9kLglXCqPv-nnptecq2Gtu6w5FG2_i-rMMkHD8UxuwSY6kP9i3K-O-pX3b_NMGEPmSAwPftRSrzlw";

export default function PushManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if browser supports push notifications
    if (!("serviceWorker" in navigator && "PushManager" in window)) return;

    async function initPush() {
      try {
        // Step 1: Register or get existing service worker
        const registration = await navigator.serviceWorker.ready;

        // Step 2: Check existing subscription
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          setIsSubscribed(true);
          return; // Already subscribed
        }

        // Step 3: Request permission automatically
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("❌ Notification permission denied");
          return;
        }

        // Step 4: Subscribe user
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });

        // Step 5: Send subscription to backend
        const response = await fetch(
          "http://localhost:3000/api/save-subscription",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
          }
        );

        if (!response.ok) throw new Error("Failed to save subscription");

        setIsSubscribed(true);
      } catch (err) {
        console.error("Push subscription error:", err);
      }
    }

    initPush();
  }, []);

  return (
    <button
      className="!bg-blue-500 text-white text-2xl px-6 py-3 rounded-lg"
      disabled={isSubscribed}
    >
      {isSubscribed ? "✅ Notifications Enabled" : "🔔 Notifications Pending"}
    </button>
  );
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
