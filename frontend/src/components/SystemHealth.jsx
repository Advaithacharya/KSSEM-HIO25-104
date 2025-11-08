import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { exportSystemHealthReport } from '../utils/exportUtils';

export const SystemHealth = () => {
  const [health, setHealth] = useState({
    websocketConnected: false,
    apiStatus: 'unknown',
    databaseConnected: false,
    activeStreams: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    apiResponseTime: 0,
    lastUpdated: new Date()
  });

  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    fps: 0
  });

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    const startTime = Date.now();
    
    try {
      // Check API health
      const response = await fetch('http://localhost:8000/api/health');
      const apiResponseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setHealth(prev => ({
          ...prev,
          apiStatus: 'healthy',
          databaseConnected: data.database || false,
          activeStreams: data.active_streams || 0,
          apiResponseTime,
          lastUpdated: new Date()
        }));
      } else {
        setHealth(prev => ({ ...prev, apiStatus: 'degraded', apiResponseTime }));
      }
    } catch (error) {
      setHealth(prev => ({
        ...prev,
        apiStatus: 'down',
        lastUpdated: new Date()
      }));
    }

    // Fetch alerts count
    try {
      const alertsRes = await fetch('http://localhost:8000/api/alerts');
      if (alertsRes.ok) {
        const alerts = await alertsRes.json();
        setHealth(prev => ({
          ...prev,
          totalAlerts: alerts.length,
          activeAlerts: alerts.filter(a => a.status === 'active').length
        }));
      }
    } catch (error) {
      console.error('Error fetching alerts for health:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
      case 'disconnected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIndicator = (isHealthy) => {
    return isHealthy
      ? '🟢'
      : '🔴';
  };

  const handleExport = () => {
    exportSystemHealthReport(health);
  };

  return (
    <div className="space-y-6 dark:text-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🏥 System Health
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">Monitor system performance and status</p>
        </div>
        <div className="flex space-x-2">
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <span className="relative z-10 flex items-center gap-2">
              📄 Export Report
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
          <motion.button
            onClick={fetchSystemHealth}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <span className="relative z-10 flex items-center gap-2">
              🔄 Refresh
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>
      </motion.div>

      {/* Status Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* API Status */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-semibold text-green-700 dark:text-green-300">API Status</h3>
            <span className="text-3xl">{getStatusIndicator(health.apiStatus === 'healthy')}</span>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent relative z-10">
            {health.apiStatus.toUpperCase()}
          </p>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1 relative z-10">
            Response: {health.apiResponseTime}ms
          </p>
        </motion.div>

        {/* Database */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700 overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">Database</h3>
            <span className="text-3xl">{getStatusIndicator(health.databaseConnected)}</span>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent relative z-10">
            {health.databaseConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </p>
        </motion.div>

        {/* Active Streams */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700 overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300">Video Streams</h3>
            <span className="text-3xl">📹</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent relative z-10">{health.activeStreams}</p>
          <p className="text-sm text-purple-700 dark:text-purple-400 relative z-10">Active streams</p>
        </motion.div>

        {/* Alerts */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/20 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Alerts</h3>
            <span className="text-3xl">🚨</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent relative z-10">{health.activeAlerts}</p>
          <p className="text-sm text-red-700 dark:text-red-400 relative z-10">
            of {health.totalAlerts} total
          </p>
        </motion.div>
      </motion.div>

      {/* Detailed Metrics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 dark:text-white">System Metrics</h3>
        
        <div className="space-y-4">
          {/* API Response Time */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium dark:text-gray-300">API Response Time</span>
              <span className="text-sm font-medium dark:text-gray-300">{health.apiResponseTime}ms</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  health.apiResponseTime < 100
                    ? 'bg-green-600'
                    : health.apiResponseTime < 300
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${Math.min((health.apiResponseTime / 500) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Memory (Simulated) */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium dark:text-gray-300">Memory Usage</span>
              <span className="text-sm font-medium dark:text-gray-300">{metrics.memory}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.memory < 70 ? 'bg-green-600' : metrics.memory < 85 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>

          {/* Uptime */}
          <div>
            <div className="flex justify-between">
              <span className="text-sm font-medium dark:text-gray-300">Last Updated</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {health.lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SystemHealth;
