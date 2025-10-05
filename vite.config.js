import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./manifest";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      injectRegister: "auto",
      injectManifest: {
        swSrc: "src/sw.js",
        swDest: "dist/sw.js",
      },
      manifest: manifestForPlugIn,
      devOptions: {
        enabled: true, // allow testing PWA in dev mode
      },
    }),
  ],
});
