import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST || []);

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "Hello", body: "World" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon.svg",
    })
  );
});
