import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useKeyboardShortcut({
    'ctrl+k': () => setIsOpen(true),
    'meta+k': () => setIsOpen(true),
    'escape': () => setIsOpen(false)
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Search across multiple data sources
        const searchData = await performSearch(query);
        setResults(searchData);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = [];

    // Mock search - replace with actual API calls
    const mockData = {
      pages: [
        { type: 'page', title: 'Dashboard', path: '/dashboard', icon: '📊' },
        { type: 'page', title: 'Alerts', path: '/alerts', icon: '🔔' },
        { type: 'page', title: 'Contacts', path: '/contacts', icon: '👥' },
        { type: 'page', title: 'Screen Capture', path: '/screen-capture', icon: '📸' },
        { type: 'page', title: 'System Health', path: '/system', icon: '🏥' }
      ],
      contacts: [
        { type: 'contact', title: 'Dr. Sarah Johnson', role: 'Doctor', id: 1, icon: '👨‍⚕️' },
        { type: 'contact', title: 'Nurse Emma Wilson', role: 'Nurse', id: 2, icon: '👩‍⚕️' }
      ],
      alerts: [
        { type: 'alert', title: 'Patient Fall Alert', severity: 'critical', id: 1, icon: '🚨' },
        { type: 'alert', title: 'Medication Reminder', severity: 'info', id: 2, icon: '💊' }
      ]
    };

    // Search pages
    mockData.pages.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
    });

    // Search contacts
    mockData.contacts.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || item.role.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
    });

    // Search alerts
    mockData.alerts.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  };

  const handleSelect = (result) => {
    if (result.type === 'page') {
      navigate(result.path);
    } else if (result.type === 'contact') {
      navigate(`/contacts?id=${result.id}`);
    } else if (result.type === 'alert') {
      navigate(`/alerts?id=${result.id}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, contacts, alerts..."
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none outline-none text-neutral-900 dark:text-white placeholder-neutral-400 text-lg"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded border border-neutral-300 dark:border-neutral-600">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-neutral-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-300 border-t-purple-600"></div>
                <p className="mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, idx) => (
                  <button
                    key={`${result.type}-${idx}`}
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-left"
                  >
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                        {result.type} {result.role && `• ${result.role}`}
                      </p>
                    </div>
                    {result.severity && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        result.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {result.severity}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="p-8 text-center text-neutral-500">
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500">
                <p className="text-sm">Type to search pages, contacts, and alerts</p>
                <div className="mt-4 space-y-2 text-xs">
                  <p><kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">Ctrl/Cmd + K</kbd> to open</p>
                  <p><kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">ESC</kbd> to close</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
