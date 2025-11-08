import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme, themes } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Settings() {
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion
  } = useTheme();
  
  const toast = useToast();
  const [soundEnabled, setSoundEnabled] = useLocalStorage('guardian-sound', true);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('guardian-notifications', true);
  const [autoRefresh, setAutoRefresh] = useLocalStorage('guardian-auto-refresh', true);
  const [refreshInterval, setRefreshInterval] = useLocalStorage('guardian-refresh-interval', 30);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    setTheme('light');
    setFontSize('medium');
    setHighContrast(false);
    setReducedMotion(false);
    setSoundEnabled(true);
    setNotificationsEnabled(true);
    setAutoRefresh(true);
    setRefreshInterval(30);
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-purple-900/10 dark:to-neutral-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            ⚙️ Settings
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Customize your Guardian AI experience
          </p>
        </motion.div>

        <div className="space-y-6">
          
          {/* Appearance Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🎨</span>
              Appearance
            </h2>
            
            {/* Theme Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, themeData]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === key
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                        key === 'light' ? 'from-white to-gray-200' :
                        key === 'dark' ? 'from-gray-800 to-black' :
                        key === 'ocean' ? 'from-blue-600 to-cyan-600' :
                        key === 'forest' ? 'from-green-600 to-emerald-600' :
                        key === 'sunset' ? 'from-orange-600 to-pink-600' :
                        'from-indigo-600 to-purple-600'
                      }`}></div>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {themeData.name}
                      </span>
                    </div>
                    {theme === key && (
                      <span className="text-xs text-purple-600 dark:text-purple-400 mt-2 block">
                        ✓ Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['small', 'medium', 'large', 'xlarge'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                      fontSize === size
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-purple-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Accessibility Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">♿</span>
              Accessibility
            </h2>
            
            <div className="space-y-4">
              <ToggleSetting
                label="High Contrast"
                description="Increase color contrast for better visibility"
                checked={highContrast}
                onChange={setHighContrast}
              />
              <ToggleSetting
                label="Reduced Motion"
                description="Minimize animations and transitions"
                checked={reducedMotion}
                onChange={setReducedMotion}
              />
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🔔</span>
              Notifications
            </h2>
            
            <div className="space-y-4">
              <ToggleSetting
                label="Enable Notifications"
                description="Receive alert notifications"
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
              />
              <ToggleSetting
                label="Sound Effects"
                description="Play sounds for alerts and actions"
                checked={soundEnabled}
                onChange={setSoundEnabled}
              />
            </div>
          </motion.div>

          {/* Data & Performance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Data & Performance
            </h2>
            
            <div className="space-y-4">
              <ToggleSetting
                label="Auto Refresh"
                description="Automatically refresh data"
                checked={autoRefresh}
                onChange={setAutoRefresh}
              />
              
              {autoRefresh && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>5s</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{refreshInterval}s</span>
                    <span>60s</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Keyboard Shortcuts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">⌨️</span>
              Keyboard Shortcuts
            </h2>
            
            <div className="space-y-3 text-sm">
              <ShortcutRow shortcut="Ctrl/Cmd + K" description="Open global search" />
              <ShortcutRow shortcut="Ctrl/Cmd + 1" description="Go to Dashboard" />
              <ShortcutRow shortcut="Ctrl/Cmd + 2" description="Go to Alerts" />
              <ShortcutRow shortcut="Ctrl/Cmd + 3" description="Go to Contacts" />
              <ShortcutRow shortcut="ESC" description="Close modals/search" />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-end"
          >
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const ToggleSetting = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-neutral-900 dark:text-white">{label}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

const ShortcutRow = ({ shortcut, description }) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded">
      <span className="text-neutral-600 dark:text-neutral-400">{description}</span>
      <kbd className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-300 dark:border-neutral-600 font-mono text-xs">
        {shortcut}
      </kbd>
    </div>
  );
};
