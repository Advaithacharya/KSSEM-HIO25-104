import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export default function Automation() {
  const [automations, setAutomations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    enabled: true,
    trigger: {
      type: 'alert_created',
      conditions: []
    },
    actions: []
  });

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = () => {
    // Load from localStorage for now
    const saved = localStorage.getItem('automations');
    if (saved) {
      setAutomations(JSON.parse(saved));
    }
  };

  const saveAutomations = (rules) => {
    localStorage.setItem('automations', JSON.stringify(rules));
    setAutomations(rules);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRule = {
      id: editingRule?.id || Date.now(),
      ...formData,
      created_at: editingRule?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let updatedRules;
    if (editingRule) {
      updatedRules = automations.map(r => r.id === editingRule.id ? newRule : r);
    } else {
      updatedRules = [...automations, newRule];
    }

    saveAutomations(updatedRules);
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this automation rule?')) {
      const updatedRules = automations.filter(r => r.id !== id);
      saveAutomations(updatedRules);
    }
  };

  const toggleEnabled = (id) => {
    const updatedRules = automations.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    saveAutomations(updatedRules);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      enabled: true,
      trigger: {
        type: 'alert_created',
        conditions: []
      },
      actions: []
    });
    setEditingRule(null);
    setShowForm(false);
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      trigger: {
        ...formData.trigger,
        conditions: [
          ...formData.trigger.conditions,
          { field: 'alert_type', operator: 'equals', value: '' }
        ]
      }
    });
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...formData.trigger.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({
      ...formData,
      trigger: { ...formData.trigger, conditions: newConditions }
    });
  };

  const removeCondition = (index) => {
    const newConditions = formData.trigger.conditions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      trigger: { ...formData.trigger, conditions: newConditions }
    });
  };

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [
        ...formData.actions,
        { type: 'webhook', config: {} }
      ]
    });
  };

  const updateAction = (index, field, value) => {
    const newActions = [...formData.actions];
    if (field === 'type') {
      newActions[index] = { type: value, config: {} };
    } else {
      newActions[index] = {
        ...newActions[index],
        config: { ...newActions[index].config, [field]: value }
      };
    }
    setFormData({ ...formData, actions: newActions });
  };

  const removeAction = (index) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: newActions });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              ⚡ Workflow Automation
            </motion.h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Create smart automation rules with if-then logic for your alerts
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            + Create Rule
          </motion.button>
        </div>

        {/* Automation Rules List */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <AnimatePresence>
            {automations.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                        {rule.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rule.enabled
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {rule.enabled ? '✓ Active' : '✗ Disabled'}
                      </span>
                    </div>
                    
                    {/* Rule Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-medium">
                          WHEN
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {getTriggerDescription(rule.trigger)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-medium">
                          THEN
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {getActionsDescription(rule.actions)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEnabled(rule.id)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                      title={rule.enabled ? 'Disable' : 'Enable'}
                    >
                      {rule.enabled ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingRule(rule);
                        setFormData(rule);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {automations.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                No automation rules yet. Create your first rule to get started!
              </p>
            </div>
          )}
        </div>

        {/* Automation Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => resetForm()}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
                  {editingRule ? 'Edit' : 'Create'} Automation Rule
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rule Name */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Send Slack notification for critical alerts"
                    />
                  </div>

                  {/* Trigger Section */}
                  <div className="border-2 border-blue-200 dark:border-blue-900/30 rounded-xl p-6 bg-blue-50/50 dark:bg-blue-900/10">
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
                      <span>🎯</span> WHEN (Trigger)
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Trigger Type</label>
                        <select
                          value={formData.trigger.type}
                          onChange={(e) => setFormData({
                            ...formData,
                            trigger: { ...formData.trigger, type: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                        >
                          <option value="alert_created">Alert Created</option>
                          <option value="alert_acknowledged">Alert Acknowledged</option>
                          <option value="alert_resolved">Alert Resolved</option>
                          <option value="system_health_change">System Health Change</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium">Conditions (All must match)</label>
                          <button
                            type="button"
                            onClick={addCondition}
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            + Add Condition
                          </button>
                        </div>

                        {formData.trigger.conditions.map((condition, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <select
                              value={condition.field}
                              onChange={(e) => updateCondition(index, 'field', e.target.value)}
                              className="px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg flex-1"
                            >
                              <option value="alert_type">Alert Type</option>
                              <option value="severity">Severity</option>
                              <option value="source">Source</option>
                              <option value="message">Message Contains</option>
                            </select>
                            <select
                              value={condition.operator}
                              onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                              className="px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg"
                            >
                              <option value="equals">Equals</option>
                              <option value="not_equals">Not Equals</option>
                              <option value="contains">Contains</option>
                              <option value="greater_than">Greater Than</option>
                            </select>
                            <input
                              type="text"
                              value={condition.value}
                              onChange={(e) => updateCondition(index, 'value', e.target.value)}
                              className="px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg flex-1"
                              placeholder="Value"
                            />
                            <button
                              type="button"
                              onClick={() => removeCondition(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="border-2 border-purple-200 dark:border-purple-900/30 rounded-xl p-6 bg-purple-50/50 dark:bg-purple-900/10">
                    <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                      <span>⚡</span> THEN (Actions)
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium">Actions to Execute</label>
                        <button
                          type="button"
                          onClick={addAction}
                          className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          + Add Action
                        </button>
                      </div>

                      {formData.actions.map((action, index) => (
                        <div key={index} className="border-2 border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800">
                          <div className="flex gap-2 mb-3">
                            <select
                              value={action.type}
                              onChange={(e) => updateAction(index, 'type', e.target.value)}
                              className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg flex-1 font-semibold"
                            >
                              <option value="webhook">Webhook (Slack/Discord/Teams)</option>
                              <option value="email">Send Email</option>
                              <option value="sms">Send SMS</option>
                              <option value="auto_acknowledge">Auto Acknowledge</option>
                              <option value="run_script">Run Script</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeAction(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              ✕
                            </button>
                          </div>

                          {action.type === 'webhook' && (
                            <div className="space-y-2">
                              <input
                                type="url"
                                value={action.config.url || ''}
                                onChange={(e) => updateAction(index, 'url', e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                                placeholder="Webhook URL"
                              />
                              <textarea
                                value={action.config.message || ''}
                                onChange={(e) => updateAction(index, 'message', e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                                placeholder="Message template (use {{variable}} for dynamic content)"
                                rows={2}
                              />
                            </div>
                          )}

                          {action.type === 'email' && (
                            <div className="space-y-2">
                              <input
                                type="email"
                                value={action.config.to || ''}
                                onChange={(e) => updateAction(index, 'to', e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                                placeholder="Recipient email"
                              />
                              <input
                                type="text"
                                value={action.config.subject || ''}
                                onChange={(e) => updateAction(index, 'subject', e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                                placeholder="Email subject"
                              />
                            </div>
                          )}

                          {action.type === 'sms' && (
                            <input
                              type="tel"
                              value={action.config.phone || ''}
                              onChange={(e) => updateAction(index, 'phone', e.target.value)}
                              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                              placeholder="Phone number"
                            />
                          )}

                          {action.type === 'run_script' && (
                            <textarea
                              value={action.config.script || ''}
                              onChange={(e) => updateAction(index, 'script', e.target.value)}
                              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg font-mono text-sm"
                              placeholder="Script to execute"
                              rows={3}
                            />
                          )}
                        </div>
                      ))}

                      {formData.actions.length === 0 && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                          Add at least one action to execute when conditions are met
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      {editingRule ? 'Update' : 'Create'} Rule
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-semibold hover:bg-neutral-400 dark:hover:bg-neutral-600 transition-all"
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

function getTriggerDescription(trigger) {
  const typeLabels = {
    alert_created: 'Alert is created',
    alert_acknowledged: 'Alert is acknowledged',
    alert_resolved: 'Alert is resolved',
    system_health_change: 'System health changes'
  };

  let desc = typeLabels[trigger.type] || trigger.type;
  
  if (trigger.conditions && trigger.conditions.length > 0) {
    const condDesc = trigger.conditions
      .map(c => `${c.field} ${c.operator} "${c.value}"`)
      .join(' AND ');
    desc += ` where ${condDesc}`;
  }

  return desc;
}

function getActionsDescription(actions) {
  if (!actions || actions.length === 0) return 'No actions configured';
  
  return actions
    .map(a => {
      const actionLabels = {
        webhook: '📡 Send webhook',
        email: '📧 Send email',
        sms: '📱 Send SMS',
        auto_acknowledge: '✓ Auto acknowledge',
        run_script: '⚙️ Run script'
      };
      return actionLabels[a.type] || a.type;
    })
    .join(', ');
}
