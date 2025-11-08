import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = () => {
    const saved = localStorage.getItem('integrations');
    if (saved) {
      setIntegrations(JSON.parse(saved));
    }
  };

  const saveIntegrations = (newIntegrations) => {
    localStorage.setItem('integrations', JSON.stringify(newIntegrations));
    setIntegrations(newIntegrations);
  };

  const availableIntegrations = [
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      description: 'Send alerts to Slack channels',
      color: 'from-purple-500 to-pink-500',
      fields: [
        { name: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/services/...' },
        { name: 'channel', label: 'Channel', type: 'text', placeholder: '#alerts' },
        { name: 'username', label: 'Bot Username', type: 'text', placeholder: 'Guardian AI' }
      ]
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: '🎮',
      description: 'Post alerts to Discord channels',
      color: 'from-indigo-500 to-blue-500',
      fields: [
        { name: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://discord.com/api/webhooks/...' },
        { name: 'username', label: 'Bot Username', type: 'text', placeholder: 'Guardian AI' }
      ]
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: '📨',
      description: 'Send notifications to Teams channels',
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { name: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://outlook.office.com/webhook/...' }
      ]
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      description: 'Send email notifications',
      color: 'from-red-500 to-orange-500',
      fields: [
        { name: 'smtp_host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com' },
        { name: 'smtp_port', label: 'SMTP Port', type: 'number', placeholder: '587' },
        { name: 'username', label: 'Username/Email', type: 'email', placeholder: 'your@email.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        { name: 'recipients', label: 'Recipients (comma-separated)', type: 'text', placeholder: 'admin@company.com, ops@company.com' }
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      description: 'Send messages via Telegram bot',
      color: 'from-cyan-500 to-teal-500',
      fields: [
        { name: 'bot_token', label: 'Bot Token', type: 'password', placeholder: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11' },
        { name: 'chat_id', label: 'Chat ID', type: 'text', placeholder: '-1001234567890' }
      ]
    },
    {
      id: 'pagerduty',
      name: 'PagerDuty',
      icon: '🚨',
      description: 'Create incidents in PagerDuty',
      color: 'from-green-500 to-emerald-500',
      fields: [
        { name: 'integration_key', label: 'Integration Key', type: 'password', placeholder: 'R03...' },
        { name: 'routing_key', label: 'Routing Key (optional)', type: 'text', placeholder: 'Optional' }
      ]
    },
    {
      id: 'webhook',
      name: 'Custom Webhook',
      icon: '🔗',
      description: 'Send to any custom webhook endpoint',
      color: 'from-gray-500 to-slate-500',
      fields: [
        { name: 'url', label: 'Webhook URL', type: 'url', placeholder: 'https://your-api.com/webhook' },
        { name: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'PUT'], placeholder: 'POST' },
        { name: 'headers', label: 'Custom Headers (JSON)', type: 'textarea', placeholder: '{"Authorization": "Bearer token"}' }
      ]
    },
    {
      id: 'sms',
      name: 'SMS (Twilio)',
      icon: '📱',
      description: 'Send SMS alerts via Twilio',
      color: 'from-rose-500 to-red-500',
      fields: [
        { name: 'account_sid', label: 'Account SID', type: 'text', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
        { name: 'auth_token', label: 'Auth Token', type: 'password', placeholder: 'Your auth token' },
        { name: 'from_number', label: 'From Number', type: 'tel', placeholder: '+1234567890' },
        { name: 'to_numbers', label: 'To Numbers (comma-separated)', type: 'text', placeholder: '+1234567890, +0987654321' }
      ]
    }
  ];

  const handleConfigureClick = (integration) => {
    const existing = integrations.find(i => i.id === integration.id);
    setSelectedIntegration(integration);
    setFormData(existing?.config || {});
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const newIntegration = {
      id: selectedIntegration.id,
      name: selectedIntegration.name,
      icon: selectedIntegration.icon,
      enabled: true,
      config: formData,
      configured_at: new Date().toISOString()
    };

    const existingIndex = integrations.findIndex(i => i.id === selectedIntegration.id);
    let updatedIntegrations;
    
    if (existingIndex >= 0) {
      updatedIntegrations = [...integrations];
      updatedIntegrations[existingIndex] = newIntegration;
    } else {
      updatedIntegrations = [...integrations, newIntegration];
    }

    saveIntegrations(updatedIntegrations);
    setShowModal(false);
    setFormData({});
    setSelectedIntegration(null);
  };

  const handleToggle = (id) => {
    const updatedIntegrations = integrations.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    );
    saveIntegrations(updatedIntegrations);
  };

  const handleRemove = (id) => {
    if (confirm('Are you sure you want to remove this integration?')) {
      const updatedIntegrations = integrations.filter(i => i.id !== id);
      saveIntegrations(updatedIntegrations);
    }
  };

  const handleTest = (integration) => {
    alert(`Sending test notification to ${integration.name}...\n\nThis would trigger a real notification in production.`);
  };

  const isConfigured = (integrationId) => {
    return integrations.some(i => i.id === integrationId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
          >
            🔌 Integrations
          </motion.h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Connect Guardian AI with your favorite tools and platforms
          </p>
        </div>

        {/* Configured Integrations */}
        {integrations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
              Active Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{integration.icon}</div>
                      <div>
                        <h3 className="font-bold text-neutral-800 dark:text-white">
                          {integration.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          integration.enabled
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {integration.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(integration.id)}
                      className="flex-1 px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                      {integration.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleTest(integration)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => {
                        const integrationDef = availableIntegrations.find(i => i.id === integration.id);
                        handleConfigureClick(integrationDef);
                      }}
                      className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      ⚙️
                    </button>
                    <button
                      onClick={() => handleRemove(integration.id)}
                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Available Integrations */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
            Available Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                onClick={() => handleConfigureClick(integration)}
              >
                <div className={`text-5xl mb-4 p-3 rounded-lg bg-gradient-to-br ${integration.color} bg-opacity-10 w-fit`}>
                  {integration.icon}
                </div>
                <h3 className="font-bold text-lg text-neutral-800 dark:text-white mb-2">
                  {integration.name}
                  {isConfigured(integration.id) && (
                    <span className="ml-2 text-green-500">✓</span>
                  )}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {integration.description}
                </p>
                <button className={`w-full py-2 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r ${integration.color} text-white hover:shadow-lg`}>
                  {isConfigured(integration.id) ? 'Reconfigure' : 'Configure'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Configuration Modal */}
        <AnimatePresence>
          {showModal && selectedIntegration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{selectedIntegration.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                      Configure {selectedIntegration.name}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {selectedIntegration.description}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {selectedIntegration.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg font-mono text-sm"
                          placeholder={field.placeholder}
                          rows={4}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                          placeholder={field.placeholder}
                          required={field.type !== 'password'}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r ${selectedIntegration.color} hover:shadow-lg`}
                    >
                      Save Configuration
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-semibold hover:bg-neutral-400 dark:hover:bg-neutral-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
