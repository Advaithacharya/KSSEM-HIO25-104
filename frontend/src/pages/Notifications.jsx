import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Notifications() {
  const toast = useToast();
  
  // Notification Channels
  const [emailEnabled, setEmailEnabled] = useLocalStorage('notif-email', true);
  const [smsEnabled, setSmsEnabled] = useLocalStorage('notif-sms', true);
  const [pushEnabled, setPushEnabled] = useLocalStorage('notif-push', true);
  const [voiceEnabled, setVoiceEnabled] = useLocalStorage('notif-voice', false);
  
  // Integration Settings
  const [slackEnabled, setSlackEnabled] = useLocalStorage('notif-slack', false);
  const [teamsEnabled, setTeamsEnabled] = useLocalStorage('notif-teams', false);
  
  // Contact Details
  const [email, setEmail] = useLocalStorage('notif-email-address', '');
  const [phone, setPhone] = useLocalStorage('notif-phone', '');
  const [slackWebhook, setSlackWebhook] = useLocalStorage('notif-slack-webhook', '');
  const [teamsWebhook, setTeamsWebhook] = useLocalStorage('notif-teams-webhook', '');
  
  // Alert Severity Settings
  const [criticalChannels, setCriticalChannels] = useLocalStorage('notif-critical', ['email', 'sms', 'push', 'voice']);
  const [warningChannels, setWarningChannels] = useLocalStorage('notif-warning', ['email', 'push']);
  const [infoChannels, setInfoChannels] = useLocalStorage('notif-info', ['push']);
  
  // Escalation Settings
  const [escalationEnabled, setEscalationEnabled] = useLocalStorage('escalation-enabled', true);
  const [escalationDelay, setEscalationDelay] = useLocalStorage('escalation-delay', 5);
  const [escalationChain, setEscalationChain] = useLocalStorage('escalation-chain', [
    { level: 1, role: 'Assigned Nurse', delay: 0 },
    { level: 2, role: 'Charge Nurse', delay: 5 },
    { level: 3, role: 'Supervisor', delay: 10 },
    { level: 4, role: 'Manager', delay: 15 }
  ]);

  const handleSave = () => {
    toast.success('Notification settings saved successfully!');
  };

  const handleTestNotification = (channel) => {
    toast.info(`Test notification sent via ${channel}!`);
  };

  const toggleChannel = (severity, channel) => {
    const channelMap = {
      critical: [criticalChannels, setCriticalChannels],
      warning: [warningChannels, setWarningChannels],
      info: [infoChannels, setInfoChannels]
    };
    
    const [channels, setChannels] = channelMap[severity];
    
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-cyan-50/50 dark:from-neutral-900 dark:via-purple-900/10 dark:to-neutral-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            🔔 Multi-Channel Notifications
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
            Configure alerts across SMS, Email, Push, Voice, Slack, and Teams with escalation chains
          </p>
        </motion.div>

        <div className="space-y-6">
          
          {/* Notification Channels */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📱</span> Notification Channels
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <NotificationChannel
                icon="📧"
                title="Email"
                description="Receive alerts via email"
                enabled={emailEnabled}
                onToggle={setEmailEnabled}
                onTest={() => handleTestNotification('Email')}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@hospital.com"
                  className="w-full px-3 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </NotificationChannel>

              {/* SMS */}
              <NotificationChannel
                icon="💬"
                title="SMS"
                description="Text message notifications"
                enabled={smsEnabled}
                onToggle={setSmsEnabled}
                onTest={() => handleTestNotification('SMS')}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </NotificationChannel>

              {/* Push */}
              <NotificationChannel
                icon="🔔"
                title="Push Notifications"
                description="Browser/app push alerts"
                enabled={pushEnabled}
                onToggle={setPushEnabled}
                onTest={() => handleTestNotification('Push')}
              >
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Requires browser permission. Will prompt on first use.
                </p>
              </NotificationChannel>

              {/* Voice Call */}
              <NotificationChannel
                icon="☎️"
                title="Voice Call"
                description="Automated phone calls for critical alerts"
                enabled={voiceEnabled}
                onToggle={setVoiceEnabled}
                onTest={() => handleTestNotification('Voice Call')}
              >
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ Only for critical alerts. Uses same number as SMS.
                </p>
              </NotificationChannel>
            </div>
          </motion.div>

          {/* Integrations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🔗</span> Team Integrations
            </h2>
            
            <div className="space-y-4">
              {/* Slack */}
              <IntegrationChannel
                icon="💬"
                title="Slack"
                description="Send alerts to Slack channels"
                enabled={slackEnabled}
                onToggle={setSlackEnabled}
                color="purple"
              >
                <input
                  type="url"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
                  className="w-full px-3 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg dark:bg-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <a 
                  href="https://api.slack.com/messaging/webhooks" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-1 block"
                >
                  📖 How to create a Slack webhook
                </a>
              </IntegrationChannel>

              {/* Microsoft Teams */}
              <IntegrationChannel
                icon="👥"
                title="Microsoft Teams"
                description="Post alerts to Teams channels"
                enabled={teamsEnabled}
                onToggle={setTeamsEnabled}
                color="blue"
              >
                <input
                  type="url"
                  value={teamsWebhook}
                  onChange={(e) => setTeamsWebhook(e.target.value)}
                  placeholder="https://outlook.office.com/webhook/YOUR-WEBHOOK-URL"
                  className="w-full px-3 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg dark:bg-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <a 
                  href="https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block"
                >
                  📖 How to create a Teams webhook
                </a>
              </IntegrationChannel>
            </div>
          </motion.div>

          {/* Alert Severity Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Alert Routing by Severity
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Choose which channels receive alerts based on severity level
            </p>
            
            <div className="space-y-6">
              <SeverityChannelSelector
                severity="Critical"
                icon="🚨"
                color="red"
                channels={criticalChannels}
                onToggle={(channel) => toggleChannel('critical', channel)}
              />
              
              <SeverityChannelSelector
                severity="Warning"
                icon="⚠️"
                color="yellow"
                channels={warningChannels}
                onToggle={(channel) => toggleChannel('warning', channel)}
              />
              
              <SeverityChannelSelector
                severity="Info"
                icon="ℹ️"
                color="blue"
                channels={infoChannels}
                onToggle={(channel) => toggleChannel('info', channel)}
              />
            </div>
          </motion.div>

          {/* Escalation Chain */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>🔺</span> Escalation Chain
              </h2>
              <button
                onClick={() => setEscalationEnabled(!escalationEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  escalationEnabled ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    escalationEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Automatically escalate unacknowledged critical alerts to higher levels of staff
            </p>
            
            {escalationEnabled && (
              <div className="space-y-4">
                {escalationChain.map((level, idx) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border-l-4 border-purple-500"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {level.role}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {level.delay === 0 ? 'Immediate' : `After ${level.delay} minutes`}
                      </div>
                    </div>
                    <div className="text-2xl">
                      {idx < escalationChain.length - 1 && '→'}
                    </div>
                  </motion.div>
                ))}
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>How it works:</strong> If a critical alert isn't acknowledged, it automatically escalates through the chain until someone responds.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-end"
          >
            <button
              onClick={() => handleTestNotification('All Channels')}
              className="px-6 py-3 rounded-lg border-2 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
            >
              🧪 Test All Channels
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              💾 Save Settings
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const NotificationChannel = ({ icon, title, description, enabled, onToggle, onTest, children }) => {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      enabled 
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{description}</p>
          </div>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            enabled ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      
      {enabled && (
        <div className="space-y-2">
          {children}
          <button
            onClick={onTest}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            Send test notification
          </button>
        </div>
      )}
    </div>
  );
};

const IntegrationChannel = ({ icon, title, description, enabled, onToggle, color, children }) => {
  const colorClasses = {
    purple: enabled ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : '',
    blue: enabled ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
  };

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      colorClasses[color] || 'border-neutral-200 dark:border-neutral-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{description}</p>
          </div>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            enabled ? `bg-${color}-500` : 'bg-neutral-300 dark:bg-neutral-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      
      {enabled && <div className="space-y-2">{children}</div>}
    </div>
  );
};

const SeverityChannelSelector = ({ severity, icon, color, channels, onToggle }) => {
  const allChannels = [
    { id: 'email', label: '📧 Email' },
    { id: 'sms', label: '💬 SMS' },
    { id: 'push', label: '🔔 Push' },
    { id: 'voice', label: '☎️ Voice' },
    { id: 'slack', label: '💬 Slack' },
    { id: 'teams', label: '👥 Teams' }
  ];

  const colorClasses = {
    red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]}`}>
      <h3 className="font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
        <span>{icon}</span> {severity} Alerts
      </h3>
      <div className="flex flex-wrap gap-2">
        {allChannels.map(channel => (
          <button
            key={channel.id}
            onClick={() => onToggle(channel.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              channels.includes(channel.id)
                ? `bg-${color}-500 text-white`
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600'
            }`}
          >
            {channel.label}
          </button>
        ))}
      </div>
    </div>
  );
};
