import { motion } from 'framer-motion';

export default function Sparkles({ count = 8 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => {
        const angle = (360 / count) * i;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ 
              x: 0, 
              y: 0,
              scale: 0,
              opacity: 0 
            }}
            animate={{
              x: [0, x, 0],
              y: [0, y, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-300 to-pink-400 rounded-full shadow-lg" />
          </motion.div>
        );
      })}
    </>
  );
}

// Star sparkle variant
export function StarSparkle({ count = 6 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => {
        const angle = (360 / count) * i;
        const distance = 100;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        
        return (
          <motion.svg
            key={i}
            className="absolute w-4 h-4"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ 
              x: -8, 
              y: -8,
              scale: 0,
              opacity: 0,
              rotate: 0
            }}
            animate={{
              x: [0, x - 8, 0],
              y: [0, y - 8, 0],
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </motion.svg>
        );
      })}
    </>
  );
}
