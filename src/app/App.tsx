import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Mock login - em produção seria OAuth com Google
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="size-full">
      {isAuthenticated ? (
        <ChatInterface onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}