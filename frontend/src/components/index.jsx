// Sidebar.jsx
export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">GuardianAI</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Patient Monitoring</p>
      </div>
      <nav className="mt-6">
        <a href="/" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span>📊 Dashboard</span>
        </a>
        <a href="/alerts" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span>🚨 Alerts</span>
        </a>
        <a href="/contacts" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span>👥 Contacts</span>
        </a>
        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
        <a href="/screen-capture" className="flex items-center px-6 py-3 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900">
          <span>🖥️ Screen Monitoring</span>
        </a>
        <a href="/system" className="flex items-center px-6 py-3 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900">
          <span>🏥 System Health</span>
        </a>
      </nav>
    </aside>
  );
}

// Dashboard.jsx
export function Dashboard({ alerts }) {
  const activeAlerts = alerts.filter(a => a.status === 'active');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Alerts</h3>
          <p className="text-3xl font-bold dark:text-white">{alerts.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Active Alerts</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{activeAlerts.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">System Status</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">Online</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Alerts</h2>
        <div className="space-y-2">
          {alerts.slice(0, 5).map(alert => (
            <div key={alert.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <p className="font-medium dark:text-white">{alert.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Room: {alert.room_id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AlertsPanel.jsx
import { exportAlertsToCSV } from '../utils/exportUtils';

export function AlertsPanel({ alerts, onAlertsUpdate }) {
  const acknowledgeAlert = async (alert) => {
    // Use _id field from API (backend returns _id, not id)
    const alertId = alert._id || alert.id;
    if (!alertId) {
      console.error('No alert ID found', alert);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged_by: 'Nurse Admin' })
      });
      if (response.ok) {
        onAlertsUpdate();
        alert('Alert acknowledged successfully!');
      } else {
        const error = await response.text();
        alert(`Failed to acknowledge: ${error}`);
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Alert Management</h2>
        <button
          onClick={() => exportAlertsToCSV(alerts)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📄 Export CSV
        </button>
      </div>
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    alert.alert_type === 'gesture' ? 'bg-blue-100 text-blue-800' :
                    alert.alert_type === 'fall' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.alert_type}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1 dark:text-white">{alert.description}</h3>
                <p className="text-gray-600 dark:text-gray-300">Room: {alert.room_id}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {alert.status === 'active' && (
                <button
                  onClick={() => acknowledgeAlert(alert)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// VideoGrid.jsx
export function VideoGrid() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Video Feeds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(room => (
          <div key={room} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">Room {room}</h3>
            <div className="bg-gray-200 aspect-video rounded flex items-center justify-center">
              <p className="text-gray-500">Camera feed would appear here</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ContactsManager.jsx
export function ContactsManager() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Contacts Management</h2>
      <div className="space-y-4">
        <p className="text-gray-600">Manage nurse and doctor contacts here.</p>
      </div>
    </div>
  );
}

export default { Sidebar, Dashboard, AlertsPanel, VideoGrid, ContactsManager };
