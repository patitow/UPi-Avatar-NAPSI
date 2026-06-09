import { useState } from "react";
import { useAccessibility } from "../hooks/useAccessibility";
import { isSessionActive, setSessionActive } from "../utils/a11yStorage";
import { clearSiteAuthToken } from "../utils/authStorage";
import { LoginScreen } from "./upi/LoginScreen";
import { UpiChatApp } from "./upi/UpiChatApp";

export default function App() {
  const a11y = useAccessibility();
  const [authenticated, setAuthenticated] = useState(isSessionActive);

  const handleLogin = () => {
    setSessionActive(true);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setSessionActive(false);
    clearSiteAuthToken();
    setAuthenticated(false);
    a11y.announceStatus("Sessão encerrada. Você saiu do UPi.");
  };

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} a11y={a11y} />;
  }

  return <UpiChatApp a11y={a11y} onLogout={handleLogout} />;
}
