import React from 'react';

export default function Landing({ alerts }) {
  const active = alerts.filter(a => a.status === 'active').length;

  const enter = (path) => {
    try { sessionStorage.setItem('visitedLanding', '1'); } catch {}
    window.location.href = path;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <h2 className="text-4xl md:text-5xl font-extrabold">GuardianAI</h2>
      <p className="max-w-2xl text-gray-300">
        Low-cost, privacy-first AI monitoring for patient safety. Real-time gesture, fall, and voice distress detection
        with immediate escalation.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={()=>enter('/dashboard')} className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition transform hover:-translate-y-0.5">Enter Dashboard</button>
        <button onClick={()=>enter('/alerts')} className="px-6 py-3 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition">Manage Alerts</button>
        <button onClick={()=>enter('/analytics')} className="px-6 py-3 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition">View Analytics</button>
      </div>
      <div className="mt-8 text-sm text-gray-400">Active alerts now: <span className="font-semibold text-gray-200">{active}</span></div>
    </div>
  );
}
