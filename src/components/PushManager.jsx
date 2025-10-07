import { useState, useEffect } from "react";

const PUBLIC_VAPID_KEY =
  "BMHeikDEHP9kLglXCqPv-nnptecq2Gtu6w5FG2_i-rMMkHD8UxuwSY6kP9i3K-O-pX3b_NMGEPmSAwPftRSrzlw";

export default function PushManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showIosBanner, setShowIosBanner] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);

    // Detect if PWA installed (iOS or Android)
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isIos && !isInStandaloneMode) {
      // iOS browser, not installed: show banner
      setShowIosBanner(true);
      return;
    }

    if (!("serviceWorker" in navigator && "PushManager" in window)) return;

    async function subscribeUser() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          setIsSubscribed(true);
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });

        const response = await fetch(
          "https://server-1d1v.onrender.com/api/save-subscription",
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

    subscribeUser();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Status Button (Android/Desktop) */}
      {!showIosBanner && (
        <button
          className="!bg-blue-500 text-white text-2xl px-6 py-3 rounded-lg"
          disabled={isSubscribed}
        >
          {isSubscribed
            ? "✅ Notifications Enabled"
            : "🔔 Notifications Pending"}
        </button>
      )}

      {/* iOS Banner */}
      {showIosBanner && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-3 rounded-lg text-center max-w-md">
          ⚠️ To receive push notifications on iOS, please add this app to your
          Home Screen: Tap "Share" → "Add to Home Screen".
        </div>
      )}
    </div>
  );
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
