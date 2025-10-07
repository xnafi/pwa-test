import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "images",
  })
);
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/maskable.png", // Replace with your icon path
  };
  event.waitUntil(self.registration.showNotification("PWA test", options));
});
