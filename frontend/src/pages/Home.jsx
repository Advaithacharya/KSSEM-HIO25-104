import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarSparkle } from '../components/ui/Sparkles';

export default function Home({ alerts = [] }) {
  const navigate = useNavigate();
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  
  const stats = [
    { label: 'Active Alerts', value: activeAlerts, color: 'text-red-500', gradient: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20' },
    { label: 'Total Alerts', value: alerts.length, color: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
  ];

  const features = [
    {
      icon: '🔔',
      title: 'Real-time Alerts',
      description: 'Monitor system alerts and notifications in real-time with WebSocket connectivity.',
      gradient: 'from-red-500 to-pink-500',
      bg: 'from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10'
    },
    {
      icon: '📸',
      title: 'Screen Capture',
      description: 'Capture and manage screenshots with advanced annotation tools.',
      gradient: 'from-purple-500 to-indigo-500',
      bg: 'from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10'
    },
    {
      icon: '👥',
      title: 'Contact Management',
      description: 'Organize and manage your contacts with full CRUD operations.',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10'
    },
    {
      icon: '📊',
      title: 'System Health',
      description: 'Track system performance metrics and health indicators.',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 py-24 sm:py-36">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-float-slow"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Guardian AI Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                duration: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="flex justify-center mb-8"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.3)',
                    '0 0 60px rgba(59, 130, 246, 0.4)',
                    '0 0 20px rgba(6, 182, 212, 0.3)',
                    '0 0 60px rgba(168, 85, 247, 0.4)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                {/* Sparkle particles */}
                <StarSparkle count={8} />
                <motion.div
                  className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <motion.svg
                    className="w-20 h-20 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </motion.svg>
                </motion.div>
                
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-purple-400/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Pulsing particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  >
                    <div className="w-full h-full rounded-3xl border-2 border-cyan-400/50" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Animated Guardian AI Text */}
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                className="block"
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Guardian AI
                </span>
              </motion.span>
              
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                className="block text-neutral-900 dark:text-white text-3xl sm:text-4xl lg:text-5xl mt-4"
              >
                Intelligent Monitoring Platform
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Monitor alerts, manage contacts, and track system health with 
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"> AI-powered intelligence</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white text-base sm:text-lg px-8 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 w-full sm:w-auto group"
              >
                <span className="relative z-10">
                  Get Started
                  <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/alerts')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-neutral-900 text-base sm:text-lg px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 w-full sm:w-auto"
              >
                View Alerts
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className={`relative p-8 text-center rounded-2xl bg-gradient-to-br ${stat.bg} border-2 border-transparent hover:border-opacity-100 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`relative text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="relative text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-neutral-800 dark:via-purple-900/10 dark:to-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-5">
              Everything you need
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and boost productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -15, rotate: [0, -2, 2, -2, 0] }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.bg} shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2 border-transparent hover:border-opacity-50`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <motion.div 
                  className="text-5xl mb-5 relative z-10"
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    delay: idx * 0.5
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className={`relative z-10 text-lg font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-3`}>
                  {feature.title}
                </h3>
                <p className="relative z-10 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-700 dark:via-blue-700 dark:to-cyan-700 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Animated background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg sm:text-xl text-primary-50 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join developers using our platform to monitor systems and boost productivity
            </p>
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden bg-white text-purple-700 hover:text-white px-10 py-4 rounded-xl font-bold text-base sm:text-lg shadow-2xl transition-all duration-300 inline-flex items-center group"
            >
              <span className="relative z-10 flex items-center">
                Start Monitoring Now
                <svg className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
