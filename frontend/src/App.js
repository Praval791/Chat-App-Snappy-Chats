import "./App.css";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./Pages/ForgotPassword";
import SettingsPage from "./Pages/SettingsPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
