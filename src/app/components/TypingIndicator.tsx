import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-0.5">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <img
              src="/src/imports/image.png"
              alt="UPi"
              className="w-7 h-7 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Typing Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 px-6 py-4 rounded-3xl shadow-sm"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
