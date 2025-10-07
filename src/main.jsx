import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


