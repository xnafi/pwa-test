import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./manifest";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: manifestForPlugIn,
      srcDir: "src",
      filename: "sw.js",
      strategies: "injectManifest",
      injectRegister: "auto",
      workbox: {
        // pattern
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
