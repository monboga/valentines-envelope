import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function WelcomeScreen({ onNext }) {
  return (
    // motion.div base para la transición entre pantallas gestionada por AnimatePresence en App.jsx
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-50 bg-rose-50/90 backdrop-blur-sm"
    >
      <div className="text-center px-6 max-w-lg">
        {/* Ícono animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="flex justify-center mb-8 text-rose-500"
        >
          <Heart size={64} fill="currentColor" className="animate-pulse drop-shadow-lg" />
        </motion.div>

        {/* Texto de Bienvenida */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-handwriting text-5xl md:text-7xl text-rose-600 mb-6 drop-shadow-sm"
        >
          Hola, Ixchel ...
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-600 mb-12 font-medium"
        >
          Tengo algo especial para ti. ¿Estás lista?
        </motion.p>

        {/* Botón de Comenzar */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-8 py-3 bg-rose-500 text-white rounded-full shadow-xl font-semibold text-lg md:text-xl flex items-center gap-3 mx-auto hover:bg-rose-600 transition-colors border-2 border-rose-400/50"
        >
          Comenzar
          <Heart size={20} className="animate-bounce" />
        </motion.button>
      </div>
    </motion.div>
  );
}