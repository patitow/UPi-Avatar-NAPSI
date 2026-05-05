import { motion } from 'motion/react';

export type AvatarState = 'idle' | 'thinking' | 'talking' | 'happy' | 'surprised';

interface AvatarDisplayProps {
  state: AvatarState;
}

const stateToAsset = {
  idle: '/assets/static_sprites/API -ROBÔ ANIMAÇÕES.png',
  thinking: '/assets/static_sprites/API -ROBÔ ANIMAÇÕES - pesquisando.png',
  talking: '/assets/animated_sprites/API -ROBÔ ANIMAÇÕES.gif',
  happy: '/assets/static_sprites/API -ROBÔ ANIMAÇÕES - feliz com feedback.png',
  surprised: '/assets/static_sprites/API -ROBÔ ANIMAÇÕES - 3.png',
};

export function AvatarDisplay({ state }: AvatarDisplayProps) {
  const assetUrl = stateToAsset[state] || stateToAsset.idle;

  return (
    <div className="relative">
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-30"
        animate={{
          scale: state === 'thinking' ? [1, 1.2, 1] : state === 'talking' ? [1, 1.1, 1] : 1,
          opacity: state === 'idle' ? 0.3 : 0.5,
        }}
        transition={{
          duration: state === 'thinking' ? 2 : state === 'talking' ? 0.8 : 3,
          repeat: state !== 'idle' ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Avatar Image */}
      <motion.div
        animate={{
          y: state === 'idle' ? [0, -8, 0] : 0,
          rotate: state === 'thinking' ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          duration: state === 'idle' ? 3 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        <img
          src={assetUrl}
          key={assetUrl} // Force re-render for GIFs
          alt="UPi"
          className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl relative z-10"
        />
      </motion.div>

      {/* Status Indicator */}
      {state !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg"
        >
          <span className="text-xs text-slate-600">
            {state === 'thinking' ? 'Pensando...' : 'Digitando...'}
          </span>
        </motion.div>
      )}
    </div>
  );
}
