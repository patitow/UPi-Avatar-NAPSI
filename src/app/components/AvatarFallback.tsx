import { motion } from 'motion/react';

export function AvatarFallback() {
  return (
    <motion.div
      animate={{
        rotate: [0, 10, -10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
                 flex items-center justify-center shadow-2xl"
    >
      <div className="text-white text-5xl">🤖</div>
    </motion.div>
  );
}
