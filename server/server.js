import express from "express";
import webpush from "web-push";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// VAPID keys
const PUBLIC_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_KEY = process.env.PRIVATE_VAPID_KEY;
const EMAIL = process.env.EMAIL;

webpush.setVapidDetails(EMAIL, PUBLIC_KEY, PRIVATE_KEY);

// Temporary subscription store
let subscriptions = [];

// Save subscription
app.post("/api/save-subscription", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log("✅ Subscription saved:", subscription.endpoint);
  res.status(201).json({ message: "Subscription saved" });
});

// Send push notification manually
app.post("/api/send-notification", async (req, res) => {
  const { title = "Hello!", body = "This is a push notification" } = req.body;
  const payload = JSON.stringify({ title, body });

  const sendPromises = subscriptions.map((sub) =>
    webpush.sendNotification(sub, payload).catch((err) => console.error(err))
  );

  await Promise.all(sendPromises);
  res.json({ success: true });
});

// ✅ Send notification every 1 minute
setInterval(async () => {
  if (subscriptions.length === 0) return;

  const message = `Current time: ${new Date().toLocaleTimeString()}`;
  const payload = JSON.stringify({ title: "⏰ Minute Alert", body: message });

  const sendPromises = subscriptions.map((sub) =>
    webpush.sendNotification(sub, payload).catch((err) => console.error(err))
  );

  await Promise.all(sendPromises);
  console.log("🕒 Sent periodic notifications:", message);
}, 60 * 1000); // every 1 minute

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Push server running at http://localhost:${PORT}`));
