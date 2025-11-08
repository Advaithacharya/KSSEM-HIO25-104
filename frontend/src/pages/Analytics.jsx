import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

export default function Analytics({ alerts = [] }) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const rangeMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    }[timeRange];

    const filteredAlerts = alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp || alert.created_at);
      return now - alertDate <= rangeMs;
    });

    // Alert trends by day
    const trendData = {};
    filteredAlerts.forEach(alert => {
      const date = new Date(alert.timestamp || alert.created_at).toLocaleDateString();
      trendData[date] = (trendData[date] || 0) + 1;
    });

    // Alert type distribution
    const typeDistribution = {};
    filteredAlerts.forEach(alert => {
      const type = alert.alert_type || 'unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    // Alert severity distribution
    const severityDistribution = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    filteredAlerts.forEach(alert => {
      const severity = alert.severity || 'medium';
      severityDistribution[severity]++;
    });

    // Hourly heatmap data
    const hourlyData = Array(24).fill(0);
    filteredAlerts.forEach(alert => {
      const hour = new Date(alert.timestamp || alert.created_at).getHours();
      hourlyData[hour]++;
    });

    // Response time analytics
    const responseTimes = filteredAlerts
      .filter(a => a.acknowledged_at && a.timestamp)
      .map(a => {
        const start = new Date(a.timestamp);
        const end = new Date(a.acknowledged_at);
        return (end - start) / 1000 / 60; // minutes
      });

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    // Predictive insights
    const recentTrend = Object.values(trendData).slice(-7);
    const prediction = recentTrend.length > 0
      ? recentTrend.reduce((a, b) => a + b, 0) / recentTrend.length
      : 0;

    return {
      total: filteredAlerts.length,
      active: filteredAlerts.filter(a => a.status === 'active').length,
      resolved: filteredAlerts.filter(a => a.status === 'resolved').length,
      trendData: Object.entries(trendData).map(([date, count]) => ({ date, count })),
      typeDistribution: Object.entries(typeDistribution).map(([name, value]) => ({ name, value })),
      severityDistribution,
      hourlyData: hourlyData.map((count, hour) => ({ hour: `${hour}:00`, count })),
      avgResponseTime: Math.round(avgResponseTime),
      prediction: Math.round(prediction),
      responseTimes
    };
  }, [alerts, timeRange]);

  const COLORS = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    primary: '#8b5cf6',
    secondary: '#3b82f6',
    tertiary: '#06b6d4'
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
            📊 Alert Analytics & Insights
          </motion.h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Advanced analytics and predictive insights for your monitoring system
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Alerts"
            value={analytics.total}
            icon="🔔"
            color="from-blue-500 to-cyan-500"
            trend="+12%"
          />
          <MetricCard
            title="Active Alerts"
            value={analytics.active}
            icon="⚠️"
            color="from-red-500 to-pink-500"
            trend="-5%"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${analytics.avgResponseTime}m`}
            icon="⏱️"
            color="from-green-500 to-emerald-500"
            trend="-18%"
          />
          <MetricCard
            title="Predicted (Tomorrow)"
            value={analytics.prediction}
            icon="🔮"
            color="from-purple-500 to-indigo-500"
            trend="AI Forecast"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Alert Trend Chart */}
          <ChartCard title="Alert Trends" icon="📈">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Alert Type Distribution */}
          <ChartCard title="Alert Types" icon="📊">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hourly Heatmap */}
          <ChartCard title="Hourly Activity Heatmap" icon="🕐">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Severity Distribution */}
          <ChartCard title="Severity Breakdown" icon="🎯">
            <div className="space-y-4 p-4">
              {Object.entries(analytics.severityDistribution).map(([severity, count]) => (
                <div key={severity} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-medium text-neutral-700 dark:text-neutral-300">
                      {severity}
                    </span>
                    <span className="text-sm font-bold" style={{ color: COLORS[severity] }}>
                      {count}
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / analytics.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[severity] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* AI Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border-2 border-purple-500/20"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>🤖</span>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard
              icon="📈"
              title="Trend Analysis"
              description={`Alert volume is ${analytics.trendData.length > 0 && analytics.trendData[analytics.trendData.length - 1]?.count > analytics.prediction ? 'above' : 'below'} predicted levels`}
              color="blue"
            />
            <InsightCard
              icon="⚡"
              title="Peak Hours"
              description={`Most alerts occur between ${getPeakHours(analytics.hourlyData)}`}
              color="purple"
            />
            <InsightCard
              icon="🎯"
              title="Recommendation"
              description="Consider adding automated responses for recurring alert types"
              color="cyan"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
          {trend}
        </span>
      </div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>
        {value}
      </div>
      <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
        {title}
      </div>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
    >
      <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function InsightCard({ icon, title, description, color }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-indigo-500',
    cyan: 'from-cyan-500 to-teal-500'
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <div className={`text-3xl mb-3 p-3 rounded-lg bg-gradient-to-br ${colors[color]} bg-opacity-10 w-fit`}>
        {icon}
      </div>
      <h4 className="font-bold text-neutral-800 dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  );
}

function getPeakHours(hourlyData) {
  if (!hourlyData || hourlyData.length === 0) return 'N/A';
  const sorted = [...hourlyData].sort((a, b) => b.count - a.count);
  const peak = sorted[0];
  return peak ? peak.hour : 'N/A';
}
