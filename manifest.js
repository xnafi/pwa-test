export const manifestForPlugIn = {
  manifest: {
    name: "React Vite App",
    short_name: "ReactVite",
    description: "A simple Vite-powered React application",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
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
        src: "/maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
};
