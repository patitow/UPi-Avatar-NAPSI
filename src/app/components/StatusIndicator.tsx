import { motion } from 'motion/react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy';
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Online',
      pulse: true,
    },
    busy: {
      color: 'bg-amber-500',
      label: 'Ocupado',
      pulse: true,
    },
    offline: {
      color: 'bg-slate-400',
      label: 'Offline',
      pulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {config.pulse && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.color} opacity-75`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.75, 0, 0.75],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
      <span className="text-xs text-slate-600">{config.label}</span>
    </div>
  );
}
