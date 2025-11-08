import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Team({ alerts = [] }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'member',
    phone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedMembers = localStorage.getItem('teamMembers');
    const savedComments = localStorage.getItem('alertComments');
    
    if (savedMembers) setTeamMembers(JSON.parse(savedMembers));
    if (savedComments) setComments(JSON.parse(savedComments));
  };

  const saveMembers = (members) => {
    localStorage.setItem('teamMembers', JSON.stringify(members));
    setTeamMembers(members);
  };

  const saveComments = (newComments) => {
    localStorage.setItem('alertComments', JSON.stringify(newComments));
    setComments(newComments);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    const newMember = {
      id: Date.now(),
      ...memberForm,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    saveMembers([...teamMembers, newMember]);
    setMemberForm({ name: '', email: '', role: 'member', phone: '' });
    setShowAddMember(false);
  };

  const handleAssign = (alertId, memberId) => {
    // In a real app, this would update the alert via API
    const updatedAlerts = alerts.map(a =>
      a.id === alertId ? { ...a, assigned_to: memberId } : a
    );
    console.log('Alert assigned:', alertId, 'to member:', memberId);
  };

  const handleAddComment = (alertId) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      alertId,
      user: 'Current User', // Replace with actual user
      text: newComment,
      timestamp: new Date().toISOString()
    };

    const updatedComments = {
      ...comments,
      [alertId]: [...(comments[alertId] || []), comment]
    };

    saveComments(updatedComments);
    setNewComment('');
  };

  const handleEscalate = (alertId) => {
    // In a real app, this would trigger escalation workflow
    console.log('Escalating alert:', alertId);
    alert('Alert escalated to senior team members');
  };

  const getAssignedMember = (memberId) => {
    return teamMembers.find(m => m.id === memberId);
  };

  const getMemberStats = (memberId) => {
    const assigned = alerts.filter(a => a.assigned_to === memberId);
    const resolved = assigned.filter(a => a.status === 'resolved');
    return {
      assigned: assigned.length,
      resolved: resolved.length,
      active: assigned.filter(a => a.status === 'active').length
    };
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
            👥 Team Collaboration
          </motion.h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage team members, assign alerts, and collaborate on resolutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Team Members
                </h2>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Add Member"
                >
                  +
                </button>
              </div>

              {/* Add Member Form */}
              {showAddMember && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddMember}
                  className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-3"
                >
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-sm"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    required
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-sm"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-sm"
                    placeholder="Phone (optional)"
                  />
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-sm"
                  >
                    <option value="member">Member</option>
                    <option value="lead">Team Lead</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      className="px-3 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Members List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {teamMembers.map((member) => {
                  const stats = getMemberStats(member.id);
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-neutral-800 dark:text-white truncate">
                            {member.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {member.email}
                          </div>
                          <div className="flex gap-2 mt-2 text-xs">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                              {stats.assigned} assigned
                            </span>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                              {stats.resolved} resolved
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {teamMembers.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
                    No team members yet. Add your first member!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alerts with Assignment Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6">
                Alert Management
              </h2>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${
                            alert.status === 'active' ? 'bg-red-500' : 'bg-green-500'
                          }`} />
                          <span className="font-semibold text-neutral-800 dark:text-white">
                            {alert.alert_type || 'Alert'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {alert.severity || 'medium'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          {alert.message || alert.description}
                        </p>

                        {/* Assignment */}
                        <div className="flex items-center gap-3 mb-3">
                          <select
                            value={alert.assigned_to || ''}
                            onChange={(e) => handleAssign(alert.id, parseInt(e.target.value))}
                            className="px-3 py-1 text-sm bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                          >
                            <option value="">Unassigned</option>
                            {teamMembers.map(member => (
                              <option key={member.id} value={member.id}>
                                Assign to {member.name}
                              </option>
                            ))}
                          </select>

                          {alert.assigned_to && (
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <span>👤</span>
                              <span>{getAssignedMember(alert.assigned_to)?.name}</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleEscalate(alert.id)}
                            className="ml-auto px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            ⬆️ Escalate
                          </button>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                          <button
                            onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline mb-2"
                          >
                            💬 {(comments[alert.id] || []).length} Comments
                            {selectedAlert === alert.id ? ' ▼' : ' ▶'}
                          </button>

                          <AnimatePresence>
                            {selectedAlert === alert.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 mt-3"
                              >
                                {/* Comments List */}
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {(comments[alert.id] || []).map(comment => (
                                    <div
                                      key={comment.id}
                                      className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-neutral-800 dark:text-white">
                                          {comment.user}
                                        </span>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                          {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                        {comment.text}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                {/* Add Comment */}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') handleAddComment(alert.id);
                                    }}
                                    className="flex-1 px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border rounded-lg"
                                    placeholder="Add a comment..."
                                  />
                                  <button
                                    onClick={() => handleAddComment(alert.id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                                  >
                                    Send
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {alerts.length === 0 && (
                  <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                    No alerts to manage
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
