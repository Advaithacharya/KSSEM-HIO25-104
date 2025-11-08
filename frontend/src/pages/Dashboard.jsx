import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard({ alerts = [] }) {
  const navigate = useNavigate();
  const [activityFeed, setActivityFeed] = useState([]);


  // Generate activity feed from alerts
  useEffect(() => {
    const recentActivity = alerts.slice(0, 10).map((alert, idx) => ({
      id: idx,
      type: 'alert',
      title: `Alert: ${alert.alert_type}`,
      description: alert.message || 'System alert triggered',
      timestamp: alert.created_at || new Date().toISOString(),
      severity: alert.alert_type
    }));
    setActivityFeed(recentActivity);
  }, [alerts]);

  const quickLinks = [
    { icon: '🔔', label: 'View Alerts', path: '/alerts', color: 'text-red-500', gradient: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20' },
    { icon: '👥', label: 'Contacts', path: '/contacts', color: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
    { icon: '📸', label: 'Capture', path: '/screen-capture', color: 'text-green-500', gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' },
    { icon: '📊', label: 'System', path: '/system', color: 'text-purple-500', gradient: 'from-purple-500 to-indigo-500', bg: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-purple-900/10 dark:to-neutral-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            Dashboard
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Monitor your alerts and recent activity
          </p>
        </div>

        {/* Quick Access Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickLinks.map((link, idx) => (
            <motion.button
              key={idx}
              onClick={() => navigate(link.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${link.bg} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 border-transparent`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <motion.div 
                className={`text-4xl mb-3 relative z-10`}
                animate={{ rotate: [0, 5, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: idx * 0.3 }}
              >
                {link.icon}
              </motion.div>
              <div className={`relative z-10 text-sm font-bold bg-gradient-to-r ${link.gradient} bg-clip-text text-transparent`}>
                {link.label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Activity Feed - Full Width */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="card p-4 space-y-4">
              {activityFeed.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                activityFeed.map((activity) => (
                  <div key={activity.id} className="flex space-x-3 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.severity === 'critical' ? 'bg-red-500' :
                      activity.severity === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Active Alerts</span>
                <span className="text-sm font-semibold text-red-500">
                  {alerts.filter(a => a.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Total Alerts</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {alerts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
