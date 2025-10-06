import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./manifest";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // VitePWA({
    //   manifest: manifestForPlugIn,
    //   srcDir: "src",
    //   filename: "sw.js",
    //   strategies: "injectManifest",
    //   injectRegister: "auto",
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //   },
    // }),
  ],
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
