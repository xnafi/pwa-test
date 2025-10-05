import { useState, useEffect } from "react";

const PUBLIC_VAPID_KEY =
  "BMHeikDEHP9kLglXCqPv-nnptecq2Gtu6w5FG2_i-rMMkHD8UxuwSY6kP9i3K-O-pX3b_NMGEPmSAwPftRSrzlw";

export default function PushManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) setIsSubscribed(true);
      });
    }
  }, []);

  async function subscribe() {
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      alert("❌ Push notifications are not supported in this browser.");
      return;
    }

    // Step 1: Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("❌ Notification permission denied");
      return;
    }

    try {
      // Step 2: Wait for service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Step 3: Subscribe user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      // Step 4: Send subscription to backend
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
      alert("✅ Notifications enabled!");
    } catch (err) {
      console.error("Subscription error:", err);
      alert("❌ Failed to subscribe for notifications");
    }
  }

  return (
    <button
      className="!bg-blue-500 text-white text-2xl px-6 py-3 rounded-lg"
      onClick={subscribe}
      disabled={isSubscribed}
    >
      {isSubscribed ? "✅ Notifications Enabled" : "🔔 Enable Notifications"}
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
