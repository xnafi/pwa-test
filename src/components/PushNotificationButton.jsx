import React, { useState, useEffect } from "react";
import { messaging } from "../firebase"; // make sure this exports initialized messaging
import { getToken, onMessage } from "firebase/messaging";

const PushNotificationButton = () => {
  const [token, setToken] = useState(null);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return alert("Notifications denied");

      const currentToken = await getToken(messaging, {
        vapidKey:
          "BD7sSgL8nLLpYUazCFIoR8HLF3-uJhAhNftI_xlKKjDkAmymcKtxszoss0pm0wa61qfPv68XjRQg957a3-_psFw",
      });

      if (currentToken) {
        setToken(currentToken);
        console.log("FCM Token:", currentToken);

        // Send token to backend
        await fetch("https://server-1d1v.onrender.com/api/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: currentToken }),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.svg",
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <button
      className={`!bg-blue-500 text-white text-2xl px-6 py-3 rounded-lg ${
        token ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={requestPermission}
      disabled={!!token}
    >
      {token ? "✅ Notifications Enabled" : "🔔 Enable Notifications"}
    </button>
  );
};

export default PushNotificationButton;
