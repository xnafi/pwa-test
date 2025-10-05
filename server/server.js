import express from "express";
import webpush from "web-push";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pwa-test-five-phi.vercel.app"], 
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

// ✅ VAPID keys
const PUBLIC_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_KEY = process.env.PRIVATE_VAPID_KEY;
const EMAIL = process.env.EMAIL;

webpush.setVapidDetails(`mailto:${EMAIL}`, PUBLIC_KEY, PRIVATE_KEY);

// Temporary in-memory subscription store
let subscriptions = [];

// Save a subscription
app.post("/api/save-subscription", (req, res) => {
  const subscription = req.body;

  // Avoid duplicate subscriptions
  if (!subscriptions.find((sub) => sub.endpoint === subscription.endpoint)) {
    subscriptions.push(subscription);
    console.log("✅ Subscription saved:", subscription.endpoint);
  } else {
    console.log("ℹ️ Subscription already exists:", subscription.endpoint);
  }

  res.status(201).json({ message: "Subscription saved" });
});

// Send push notification manually
app.post("/api/send-notification", async (req, res) => {
  const { title = "Hello!", body = "This is a push notification" } = req.body;
  const payload = JSON.stringify({ title, body });

  const sendPromises = subscriptions.map(async (sub, index) => {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("❌ WebPushError:", err.body || err);
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription expired or unsubscribed, remove it
        console.log("⚠️ Removing expired subscription:", sub.endpoint);
        subscriptions.splice(index, 1);
      }
    }
  });

  await Promise.all(sendPromises);
  res.json({ success: true, activeSubscriptions: subscriptions.length });
});

// Send periodic notifications every minute
setInterval(async () => {
  if (subscriptions.length === 0) return;

  const message = `Current time: ${new Date().toLocaleTimeString()}`;
  const payload = JSON.stringify({ title: "⏰ Minute Alert", body: message });

  const sendPromises = subscriptions.map(async (sub, index) => {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("❌ WebPushError:", err.body || err);
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log("⚠️ Removing expired subscription:", sub.endpoint);
        subscriptions.splice(index, 1);
      }
    }
  });

  await Promise.all(sendPromises);
  console.log("🕒 Sent periodic notifications:", message);
}, 10 * 1000); // every 1 minute

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Push server running at http://localhost:${PORT}`)
);
