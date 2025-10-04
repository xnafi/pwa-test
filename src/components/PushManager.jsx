import { useState, useEffect } from "react";

const PUBLIC_VAPID_KEY =
  "BMHeikDEHP9kLglXCqPv-nnptecq2Gtu6w5FG2_i-rMMkHD8UxuwSY6kP9i3K-O-pX3b_NMGEPmSAwPftRSrzlw";

export default function PushManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) =>
          console.error("❌ Service Worker registration failed", err)
        );

      navigator.serviceWorker.ready.then(async (reg) => {
        const subscription = await reg.pushManager.getSubscription();
        if (subscription) {
          setIsSubscribed(true);
          console.log("🔔 User is already subscribed");
        }
      });
    }
  }, []);

  async function subscribe() {
    try {
      setLoading(true);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("❌ Notification permission denied.");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      await fetch("http://localhost:3000/api/save-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      setIsSubscribed(true);
      alert("✅ Notifications enabled!");

      // Optional: send test notification
      await fetch("http://localhost:3000/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Welcome! 🎉",
          body: "Notifications are now enabled from backend.",
        }),
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to enable notifications");
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    try {
      setLoading(true);

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        // Optionally, notify backend to remove subscription
        await fetch("http://localhost:3000/api/remove-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        setIsSubscribed(false);
        alert("❌ Notifications disabled!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to unsubscribe");
    } finally {
      setLoading(false);
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {isSubscribed ? (
        <button
          onClick={unsubscribe}
          disabled={loading}
          style={{
            background: "#f44336",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing…" : "❌ Disable Notifications"}
        </button>
      ) : (
        <button
          onClick={subscribe}
          disabled={loading}
          style={{
            background: "#007bff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Enabling…" : "🔔 Enable Notifications"}
        </button>
      )}
    </div>
  );
}
