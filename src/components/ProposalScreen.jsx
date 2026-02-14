import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingPetal from './ui/FloatingPetals';

export default function ProposalScreen() {
  // Estado para saber qué mostrar: 'question', 'yes', o 'no'
  const [step, setStep] = useState('question');
  
  // Reutilizamos los pétalos para mantener el ambiente romántico
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    setPetals(Array.from({ length: 30 }).map((_, i) => ({
      id: i, delay: Math.random() * 20
    })));
  }, []);

  // Variantes de animación para transiciones suaves
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-full h-full bg-rose-50 flex items-center justify-center overflow-hidden font-body px-4"
    >
      {/* Fondo de pétalos y textura */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 opacity-30 paper-texture"></div>
         {petals.map(p => <FloatingPetal key={p.id} delay={p.delay} />)}
      </div>

      {/* Contenedor principal interactivo */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          
          {/* ESTADO 1: LA PREGUNTA TIPO MINI-CARTA */}
          {step === 'question' && (
            <motion.div 
              key="question"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              // Diseño tipo tarjeta/nota elegante
              className="relative bg-white/95 paper-texture pt-16 p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-rose-200 w-full"
            >
              {/* === PLACEHOLDER DEL SELLO DE SNOOPY === */}
              <div className="absolute -top-10 md:-top-15 left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-rose-100 shadow-md overflow-hidden flex items-center justify-center relative">
                     {/* Instrucciones:
                        1. Guarda tu imagen como 'snoopy-seal.png' en public/photos/
                        2. Si es PNG transparente se verá mejor.
                     */}
                     <img
                         src="/photos/snoopy-seal.jpg" 
                         alt="Snoopy seal"
                         className="w-full h-full object-cover"
                         onError={(e) => { 
                             // Fallback visual si no hay imagen, muestra un círculo rosa
                             e.target.style.display = 'none'; 
                             e.target.parentElement.classList.add('bg-rose-200');
                             e.target.parentElement.innerHTML = '<span class="text-2xl">❤️</span>';
                         }} 
                     />
                </div>
              </div>

              {/* Cuerpo del mensaje */}
              <div className="flex flex-col items-center gap-4">
                  <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    Aún estoy a tiempo para preguntarte...
                  </p>

                  <h1 className="font-handwriting text-4xl md:text-5xl text-rose-600 mb-6 leading-tight drop-shadow-sm">
                    ¿Quieres ser mi <br/> San Valentín?
                  </h1>
                  
                  <div className="flex justify-center gap-6 w-full">
                    <button 
                      onClick={() => setStep('yes')}
                      className="flex-1 py-3 bg-rose-500 text-white rounded-full font-bold text-lg hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      ¡Sí!
                    </button>
                    <button 
                      onClick={() => setStep('no')}
                      className="flex-1 py-3 bg-zinc-100 text-zinc-500 rounded-full font-bold text-lg hover:bg-zinc-200 hover:text-zinc-700 hover:scale-95 transition-all shadow-sm cursor-pointer border border-zinc-200"
                    >
                      No
                    </button>
                  </div>
              </div>
            </motion.div>
          )}

          {/* ESTADO 2: RESPUESTA SÍ */}
          {step === 'yes' && (
            <motion.div 
              key="yes"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white p-4 rounded-2xl shadow-xl rotate-2 mb-8 border-2 border-rose-200">
                <img 
                  src="/photos/yes-proposal.gif" 
                  alt="¡Dijo que sí!" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="flex h-full items-center justify-center text-zinc-400 text-center p-2">Pon yes-proposal.gif en public/photos/</span>';
                  }}
                />
              </div>
              <h2 className="font-handwriting text-4xl md:text-5xl text-rose-600 drop-shadow-sm">
                Entonces nos vemos en unos momentos más ❤️
              </h2>
            </motion.div>
          )}

          {/* ESTADO 3: RESPUESTA NO */}
          {step === 'no' && (
            <motion.div 
              key="no"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white p-4 rounded-2xl shadow-xl -rotate-2 mb-8 border-2 border-slate-200">
                <img 
                  src="/photos/no-proposal.jpg" 
                  alt="Dijo que no :(" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="flex h-full items-center justify-center text-zinc-400 text-center p-2">Pon no-proposal.gif en public/photos/</span>';
                  }}
                />
              </div>
              <h2 className="font-handwriting text-3xl md:text-4xl text-slate-500 drop-shadow-sm mb-6">
                Quedé 🤡
              </h2>
              <button 
                onClick={() => setStep('question')}
                className="text-rose-400 font-body text-sm font-semibold underline hover:text-rose-600 cursor-pointer"
              >
                (Déjame preguntar de nuevo)
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}