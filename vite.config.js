import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./public/manifest";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      manifest: manifestForPlugIn,
      registerType: "autoUpdate",
      includeAssests: [
        "favicon.svg",
        "apple.png",
        "android.png",
        "maskable.png",
      ],
      srcDir: "public",
      filename: "serviceWorker.js",
      strategies: "injectManifest",
      injectRegister: "auto",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
