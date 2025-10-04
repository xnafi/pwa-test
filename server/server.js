import express from "express";
import webpush from "web-push";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PUBLIC_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_KEY = process.env.PRIVATE_VAPID_KEY;
const EMAIL = process.env.EMAIL;

webpush.setVapidDetails(EMAIL, PUBLIC_KEY, PRIVATE_KEY);

let subscriptions = [];

app.post("/api/save-subscription", (req, res) => {
  subscriptions.push(req.body);
  console.log("✅ Subscription saved:", req.body.endpoint);
  res.status(201).json({ message: "Subscription saved" });
});

app.post("/api/send-notification", async (req, res) => {
  const { title = "Hello!", body = "This is a push notification" } = req.body;
  const payload = JSON.stringify({ title, body });

  await Promise.all(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload).catch(console.error)
    )
  );

  res.json({ success: true });
});

// Send notification every 1 minute
setInterval(async () => {
  if (!subscriptions.length) return;

  const payload = JSON.stringify({
    title: "⏰ Minute Alert",
    body: `Current time: ${new Date().toLocaleTimeString()}`,
  });

  await Promise.all(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload).catch(console.error)
    )
  );
  console.log("🕒 Sent periodic notifications");
}, 10 * 1000);

app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Push server running")
);
