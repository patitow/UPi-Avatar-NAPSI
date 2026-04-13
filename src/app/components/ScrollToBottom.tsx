import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomProps {
  onClick: () => void;
  visible: boolean;
}

export function ScrollToBottom({ onClick, visible }: ScrollToBottomProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          aria-label="Rolar para o final"
          className="fixed bottom-32 right-6 md:right-8 z-20
                     p-3 bg-gradient-to-br from-cyan-500 to-blue-500
                     text-white rounded-full shadow-lg shadow-cyan-500/30
                     hover:shadow-xl hover:shadow-cyan-500/40
                     transition-all duration-200"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
