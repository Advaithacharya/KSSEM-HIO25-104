import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500`}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
        }}
      />
    </div>
  );
}

// Alternative spinner styles
export function DotSpinner() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{
            background: i === 0 
              ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
              : i === 1 
              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' 
              : 'linear-gradient(135deg, #10b981, #14b8a6)'
          }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export function PulseSpinner() {
  return (
    <div className="relative w-16 h-16">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
          initial={{ opacity: 0.8, scale: 0 }}
          animate={{
            opacity: [0.8, 0],
            scale: [0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600" />
      </div>
    </div>
  );
}
