export default function SendTestButton() {
  async function sendNotification() {
    const reg = await navigator.serviceWorker.ready;
    const sw = reg.active || reg.waiting || reg.installing;
    if (!sw) return alert("Service Worker not ready");

    sw.postMessage({
      title: "Quantum OS 🔔",
      body: "This notification is sent directly from frontend!",
    });
  }

  return (
    <button
      onClick={sendNotification}
      style={{
        background: "#007bff",
        color: "white",
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Send Notification from Frontend
    </button>
  );
}
