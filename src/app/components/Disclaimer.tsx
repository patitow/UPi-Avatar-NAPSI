import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export function Disclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3"
    >
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800 leading-relaxed">
        <p className="mb-2">
          <strong>Importante:</strong> O UPi é um assistente virtual para informações gerais.
        </p>
        <ul className="space-y-1 text-xs">
          <li>• Não oferece aconselhamento psicológico ou médico</li>
          <li>• Para questões específicas, entre em contato com o NAPSI</li>
          <li>• Email: napsi@poli.upe.br</li>
        </ul>
      </div>
    </motion.div>
  );
}
