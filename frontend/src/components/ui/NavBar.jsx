import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// SVG Icons
const SearchIcon = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LogoIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
          U
        </div>
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 card border shadow-lg z-50">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="text-sm font-medium">User Admin</div>
            <div className="text-xs muted">admin@guardian-ai.dev</div>
          </div>
          
          <div className="py-2">
            <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">
              Your profile
            </a>
            <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">
              Settings
            </Link>
            <div className="border-t border-neutral-200 dark:border-neutral-700 mt-2 pt-2">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ isOpen, setIsOpen }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/alerts', label: 'Alerts', icon: '🚨' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/automation', label: 'Automation', icon: '⚡' },
    { path: '/team', label: 'Team', icon: '👥' },
    { path: '/contacts', label: 'Contacts', icon: '📞' },
    { path: '/screen-capture', label: 'Monitoring', icon: '🖥️' },
    { path: '/system', label: 'System', icon: '🏥' },
  ];

  return (
    <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 pb-3 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              location.pathname === item.path
                ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function NavBar({ isConnected, activeCount, children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/automation', label: 'Automation' },
    { path: '/team', label: 'Team' },
    { path: '/contacts', label: 'Contacts' },
    { path: '/screen-capture', label: 'Monitoring' },
    { path: '/system', label: 'System' },
  ];

  return (
    <>
      <nav className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Left side - Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="text-purple-600 dark:text-purple-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all duration-300 group-hover:scale-110">
                  <LogoIcon />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                  Guardian AI
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'text-neutral-600 hover:text-purple-600 hover:bg-purple-50 dark:text-neutral-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, repositories..."
                  className="block w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side - Actions & Profile */}
            <div className="flex items-center space-x-4">
              
              {/* Status indicators */}
              <div className="hidden sm:flex items-center space-x-3">
                {/* Connection status */}
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isConnected 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{isConnected ? 'Connected' : 'Offline'}</span>
                </div>

                {/* Active alerts */}
                {activeCount > 0 && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
                    <BellIcon />
                    <span>{activeCount}</span>
                  </div>
                )}
              </div>

              {/* Theme & Sound toggles */}
              <div className="flex items-center space-x-2">
                {children}
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 relative">
                <BellIcon />
                {activeCount > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {activeCount > 9 ? '9+' : activeCount}
                  </span>
                )}
              </button>

              {/* Profile dropdown */}
              <UserDropdown />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      </nav>
    </>
  );
}