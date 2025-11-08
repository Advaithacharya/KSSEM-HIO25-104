import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AlertsPanel } from './components/index';
import ContactsManager from './components/ContactsManager';
import ScreenCapture from './components/ScreenCapture';
import SystemHealth from './components/SystemHealth';
import { useTheme } from './contexts/ThemeContext';
import { useToast, ToastProvider } from './contexts/ToastContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import alertSoundManager from './utils/alertSounds';
import { exportAlertsToCSV } from './utils/exportUtils';
import NavBar from './components/ui/NavBar';
import GlobalSearch from './components/GlobalSearch';
import VoiceAssistant from './components/VoiceAssistant';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Automation from './pages/Automation';
import Team from './pages/Team';
import Integrations from './pages/Integrations';

function AppContent() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const websocket = new WebSocket('ws://localhost:8000/ws');

      websocket.onopen = () => {
        setIsConnected(true);
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      websocket.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = () => {};

      wsRef.current = websocket;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    if (data.type && data.type.includes('alert')) {
      fetchAlerts();
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Play sound when new alert arrives
  useEffect(() => {
    if (alerts.length > 0) {
      const activeAlerts = alerts.filter(a => a.status === 'active');
      if (activeAlerts.length > 0) {
        const latestAlert = activeAlerts[0];
        alertSoundManager.playAlert(latestAlert.alert_type);
      }
    }
  }, [alerts.length]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    acknowledgeAlert: () => {
      const activeAlert = alerts.find(a => a.status === 'active');
      if (activeAlert) {
        console.log('Acknowledge alert shortcut (A) pressed');
      }
    },
    toggleDarkMode: toggleTheme,
    toggleMute: () => {
      const isEnabled = alertSoundManager.isEnabled();
      alertSoundManager.setEnabled(!isEnabled);
      console.log(`Sounds ${!isEnabled ? 'enabled' : 'muted'}`);
    },
    navigateTo: (path) => navigate(path),
    exportData: () => {
      exportAlertsToCSV(alerts);
      console.log('Exported alerts to CSV');
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <GlobalSearch />
      <VoiceAssistant alerts={alerts} />
      <NavBar isConnected={isConnected} activeCount={alerts.filter(a=>a.status==='active').length}>
        <ThemeToggle />
        <SoundToggle />
      </NavBar>
      <main>
        <Routes>
          <Route path="/" element={<Home alerts={alerts} />} />
          <Route path="/dashboard" element={<Dashboard alerts={alerts} />} />
          <Route path="/alerts" element={<div className="container py-8"><AlertsPanel alerts={alerts} onAlertsUpdate={fetchAlerts} /></div>} />
          <Route path="/contacts" element={<div className="container py-8"><ContactsManager /></div>} />
          <Route path="/screen-capture" element={<div className="container py-8"><ScreenCapture /></div>} />
          <Route path="/system" element={<div className="container py-8"><SystemHealth /></div>} />
          <Route path="/analytics" element={<Analytics alerts={alerts} />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/team" element={<Team alerts={alerts} />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Theme toggle button
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (D)`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

// Sound toggle button
function SoundToggle() {
  const [muted, setMuted] = useState(!alertSoundManager.isEnabled());
  
  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    alertSoundManager.setEnabled(!newMuted);
  };
  
  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
      title={`${muted ? 'Unmute' : 'Mute'} sounds (M)`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;
