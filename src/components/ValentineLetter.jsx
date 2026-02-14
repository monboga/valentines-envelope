import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Heart, ChevronDown, Music } from 'lucide-react';
import FloatingPetal from './ui/FloatingPetals';

export default function ValentineLetter({ onNext }) {
  const containerRef = useRef(null);
  
  // Trackeamos el scroll del contenedor principal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Suavizamos el valor del scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  // --- SECUENCIA DE ANIMACIÓN MATEMÁTICA ---
  
  // 1. La solapa se abre (0% a 20% del scroll)
  const flapRotate = useTransform(smoothProgress, [0, 0.2], [0, 180]);
  const flapZIndex = useTransform(smoothProgress, [0, 0.19, 0.2], [30, 30, 0]);
  
  // 2. La carta sube y el sobre baja simultáneamente (20% a 80% del scroll)
  // Al subir la carta un -60% de su propia altura y bajar el sobre un 15vh, 
  // logramos un efecto telescópico que mantiene todo en pantalla.
  const letterY = useTransform(smoothProgress, [0.2, 0.8], ["0%", "-60%"]);
  const letterScale = useTransform(smoothProgress, [0.2, 0.8], [0.9, 1.0]); 
  const envelopeY = useTransform(smoothProgress, [0.2, 0.8], ["0%", "15vh"]);
  
  // 3. Opacidades de la UI
  const hintOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const finalMessageOpacity = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);

  // Generación de pétalos
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    const newPetals = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 20
    }));
    setPetals(newPetals);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full bg-rose-50 font-body"
    >
      {/* CAPA DE FONDO (Textura y Pétalos) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute inset-0 opacity-30 paper-texture"></div>
         {petals.map(p => <FloatingPetal key={p.id} delay={p.delay} />)}
      </div>

      {/* CONTENEDOR DE SCROLL (Define la duración del scroll) */}
      <div ref={containerRef} className="h-[400vh] relative z-10 w-full">
        
        {/* STICKY CONTAINER (Mantiene la cámara fija en la pantalla) */}
        {/* h-[100dvh] es vital para móviles, evita que la barra de direcciones rompa el layout */}
        <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* TÍTULO INICIAL */}
          <motion.div 
            style={{ opacity: hintOpacity }}
            className="absolute top-[8%] md:top-[10%] text-center z-50 w-full px-4 pointer-events-none"
          >
            <h1 className="font-handwriting text-5xl md:text-7xl lg:text-8xl text-rose-600 mb-2 drop-shadow-sm">
              Para ti...
            </h1>
            <div className="flex flex-col items-center gap-2 text-rose-400">
               <span className="text-sm md:text-base tracking-widest uppercase font-semibold">Desliza suavemente</span>
               <ChevronDown className="animate-bounce" size={24} />
            </div>
          </motion.div>

          {/* EL SOBRE Y LA CARTA (Wrapper Animado) */}
          <motion.div 
            style={{ y: envelopeY }}
            className="relative z-10 
                       w-[90vw] max-w-[380px] h-[240px] 
                       md:max-w-[600px] md:w-[600px] md:h-[350px] 
                       lg:max-w-[700px] lg:w-[700px] lg:h-[400px]"
          >
            {/* CLIP-PATH WRAPPER: Permite que la carta "salga" hacia arriba sin ser cortada por el sobre */}
            <div className="relative w-full h-full" style={{ clipPath: 'inset(-300% -50% 0 -50%)' }}>
              
              {/* Parte Trasera del Sobre */}
              <div className="absolute inset-0 bg-rose-200 rounded-b-xl shadow-2xl border-2 border-rose-300"></div>

              {/* LA CARTA EN SÍ */}
              <motion.div 
                style={{ y: letterY, scale: letterScale }}
                className="absolute left-2 right-2 top-2 bottom-0 z-10 origin-top 
                           h-[420px] md:h-[550px] lg:h-[650px] 
                           bg-white rounded-lg shadow-xl flex flex-col items-center text-center paper-texture"
              >
                <div className="w-full h-full border-4 border-rose-100 border-double rounded-lg p-6 md:p-8 lg:p-12 flex flex-col items-center justify-between">
                  
                  <div className="flex-none">
                    <div className="mb-2 md:mb-4 text-rose-500 flex justify-center">
                      <Heart size={40} fill="currentColor" className="animate-pulse" />
                    </div>
                    <h2 className="font-handwriting text-3xl md:text-5xl lg:text-6xl text-rose-600 mb-2 md:mb-6">
                      Ixchel
                    </h2>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-center space-y-4 md:space-y-6">
                    <p className="text-base md:text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed">
                      No necesito un día especial para recordarte cuánto te quiero, aunque hoy es la excusa perfecta
                    </p>
                    <p className="text-base md:text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed">
                      Gracias por ser mi risa favorita, mi abrazo favorito y mi mejor compañia.
                    </p>
                    <p className="text-rose-500 font-handwriting text-3xl md:text-4xl lg:text-5xl pt-4">
                      ¡Te Amo!
                    </p>
                  </div>

                  <div className="flex-none pt-4 md:pt-8 w-full border-t border-rose-100 mt-4">
                    <p className="font-body text-xs md:text-sm text-slate-400 uppercase tracking-widest">
                      14 de Febrero, 2026
                    </p>
                  </div>
                  
                </div>
              </motion.div>

              {/* Bolsillos Frontales del Sobre (El recorte en V) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-rose-300 rounded-bl-xl shadow-sm" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}></div>
                <div className="absolute top-0 right-0 w-full h-full bg-rose-300 rounded-br-xl shadow-sm" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-rose-400 rounded-b-xl shadow-inner" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}></div>
              </div>

              {/* Solapa Superior (Flap) */}
              <motion.div 
                style={{ rotateX: flapRotate, zIndex: flapZIndex, transformOrigin: "top" }}
                className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none"
              >
                 <div className="w-full h-full bg-rose-500 rounded-xl shadow-lg border-t-2 border-rose-400" style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }}></div>
                 
                 {/* Sello de Corazón */}
                 <div className="absolute top-[22%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-700 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-red-800/50">
                      <Heart size={20} className="text-red-200 fill-red-200 md:scale-125" />
                    </div>
                 </div>
              </motion.div>

            </div>
          </motion.div>
          
          {/* BOTÓN FINAL (Propuesta) */}
          <motion.div 
            style={{ opacity: finalMessageOpacity }}
            className="absolute bottom-[8%] md:bottom-10 z-50 pointer-events-auto"
          >
             <button 
                onClick={onNext}
                className="px-6 py-2 md:px-8 md:py-3 bg-rose-500 text-white rounded-full shadow-lg font-semibold hover:bg-rose-600 transition-colors flex items-center gap-2 text-sm md:text-base cursor-pointer hover:scale-105 active:scale-95 duration-200"
             >
                Tengo una pregunta por hacerte <Heart size={18} className="animate-pulse" />
             </button>
          </motion.div>

        </div>
      </div>
      
      {/* Footer que aparece al final de todo el scroll */}
      <div className="relative z-10 h-[20vh] flex items-center justify-center text-rose-300 text-sm">
        14 de Febrero del 2026
      </div>
    </motion.div>
  );
}