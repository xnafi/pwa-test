export const manifestForPlugIn = {
  manifest: {
    name: "React-vite-app",
    short_name: "react-vite-app",
    description: "I am a simple vite app",
    icons: [
      {
        src: "/apple.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};
