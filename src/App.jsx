
import "./App.css";
import PushManager from "./components/PushManager";
import PushNotificationButton from "./components/PushNotificationButton";


function App() {

  return (
    <div className="h-screen w-full flex justify-center items-center flex-col space-y-9">
      <h1 className="text-5xl">Vite + React</h1>
      {/* <PushManager /> */}
      <PushNotificationButton />
    </div>
  );
}

export default App;
