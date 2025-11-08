import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    role: 'nurse',
    phone_number: '',
    email: '',
    firebase_token: '',
    priority: 1,
    active: true
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/contacts`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        priority: parseInt(formData.priority)
      };

      if (editingContact) {
        await axios.put(`${API_BASE}/api/contacts/${editingContact.id}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/contacts`, payload);
      }
      
      fetchContacts();
      resetForm();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role,
      phone_number: contact.phone_number,
      email: contact.email || '',
      firebase_token: contact.firebase_token || '',
      priority: contact.priority,
      active: contact.active
    });
    setShowForm(true);
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await axios.delete(`${API_BASE}/api/contacts/${contactId}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  };

  const toggleActive = async (contact) => {
    try {
      await axios.put(`${API_BASE}/api/contacts/${contact.id}`, {
        ...contact,
        active: !contact.active
      });
      fetchContacts();
    } catch (error) {
      console.error('Error toggling contact status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'nurse',
      phone_number: '',
      email: '',
      firebase_token: '',
      priority: 1,
      active: true
    });
    setEditingContact(null);
    setShowForm(false);
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'emergency': return '🚑';
      case 'admin': return '👤';
      default: return '👤';
    }
  };

  const getRoleGradient = (role) => {
    switch(role) {
      case 'doctor': return 'from-purple-500 to-indigo-500';
      case 'nurse': return 'from-blue-500 to-cyan-500';
      case 'emergency': return 'from-red-500 to-pink-500';
      case 'admin': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || contact.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = {
    total: contacts.length,
    doctors: contacts.filter(c => c.role === 'doctor').length,
    nurses: contacts.filter(c => c.role === 'nurse').length,
    emergency: contacts.filter(c => c.role === 'emergency').length,
    active: contacts.filter(c => c.active).length
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              👥 Contact Management
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-base">
              Manage your team members and notification preferences
            </p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Contact
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {roleStats.total}
              </div>
              <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">Total Contacts</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="text-2xl mb-1">👩‍⚕️</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {roleStats.nurses}
              </div>
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Nurses</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="text-2xl mb-1">👨‍⚕️</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {roleStats.doctors}
              </div>
              <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Doctors</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="text-2xl mb-1">🚑</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                {roleStats.emergency}
              </div>
              <div className="text-xs font-semibold text-red-700 dark:text-red-300">Emergency</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {roleStats.active}
              </div>
              <div className="text-xs font-semibold text-green-700 dark:text-green-300">Active</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'doctor', 'nurse', 'emergency', 'admin'].map((role) => (
            <motion.button
              key={role}
              onClick={() => setFilterRole(role)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterRole === role
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Form Modal */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200 dark:border-purple-700"
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {editingContact ? '✏️ Edit Contact' : '➕ Add New Contact'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 bg-white dark:bg-neutral-800 transition-all"
                      placeholder="e.g., Dr. Jane Smith"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 bg-white dark:bg-neutral-800 transition-all"
                    >
                      <option value="nurse">👩‍⚕️ Nurse</option>
                      <option value="doctor">👨‍⚕️ Doctor</option>
                      <option value="emergency">🚑 Emergency Contact</option>
                      <option value="admin">👤 Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 bg-white dark:bg-neutral-800 transition-all"
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 bg-white dark:bg-neutral-800 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                    Priority: {formData.priority} {formData.priority === 1 ? '(Highest)' : ''}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>1 - Highest</span>
                    <span>5 - Lowest</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="active" className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                    ✅ Active (receives alert notifications)
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <span className="relative z-10">{editingContact ? 'Update' : 'Create'} Contact</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contacts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredContacts.map((contact, idx) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative p-6 rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              contact.active
                ? 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 opacity-75'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getRoleGradient(contact.role)} opacity-10 rounded-full blur-2xl`}></div>
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRoleGradient(contact.role)} flex items-center justify-center text-2xl shadow-lg`}>
                  {getRoleIcon(contact.role)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{contact.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRoleGradient(contact.role)} text-white`}>
                    {contact.role}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => toggleActive(contact)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  contact.active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {contact.active ? '✓' : '✗'}
              </motion.button>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4 relative z-10">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>📞</span>
                <span className="font-mono">{contact.phone_number}</span>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>📧</span>
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span>⭐</span>
                <span className="font-semibold">Priority {contact.priority}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 relative z-10">
              <motion.button
                onClick={() => handleEdit(contact)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Edit
              </motion.button>
              <motion.button
                onClick={() => handleDelete(contact.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            No contacts found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {searchQuery || filterRole !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Get started by adding your first contact'}
          </p>
          {!searchQuery && filterRole === 'all' && (
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Add Your First Contact
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ContactsManager;
