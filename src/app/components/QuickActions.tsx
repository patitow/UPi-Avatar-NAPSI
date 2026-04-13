import { motion } from 'motion/react';

interface QuickActionsProps {
  onSelectAction: (action: string) => void;
}

const quickActions = [
  {
    icon: '📚',
    label: 'Informações Acadêmicas',
    query: 'Como funcionam as matrículas na POLI?',
  },
  {
    icon: '🤝',
    label: 'Sobre o NAPSI',
    query: 'O que é o NAPSI e como ele pode me ajudar?',
  },
  {
    icon: '📧',
    label: 'Contato',
    query: 'Como entrar em contato com o NAPSI?',
  },
  {
    icon: '♿',
    label: 'Acessibilidade',
    query: 'Quais recursos de acessibilidade a POLI oferece?',
  },
];

export function QuickActions({ onSelectAction }: QuickActionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 text-center px-4">
        Ou escolha uma das opções abaixo:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectAction(action.query)}
            className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm
                       border border-slate-200 rounded-2xl shadow-sm
                       hover:shadow-md hover:border-cyan-200
                       transition-all duration-200 text-left group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <div className="flex-1">
              <p className="text-sm text-slate-800">{action.label}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
