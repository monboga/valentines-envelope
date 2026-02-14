import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Heart, ChevronDown, Music } from 'lucide-react';

// Estilos globales
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Nunito:wght@400;600&display=swap');
    
    .font-handwriting {
      font-family: 'Great Vibes', cursive;
    }
    .font-body {
      font-family: 'Nunito', sans-serif;
    }
    
    .paper-texture {
      background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
    }
    
    /* Ocultar scrollbar pero permitir scroll funcional */
    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    
    /* FIX: Quitamos height: 100% para evitar bloqueos de scroll */
    body {
        min-height: 100vh;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        -ms-overflow-style: none;
        scrollbar-width: none; 
    }
    html {
        scroll-behavior: smooth;
    }
  `}</style>
);

// Componente Pétalo de Rosa
const FloatingPetal = ({ delay }) => {
  // FIX: Usamos useMemo para que los valores aleatorios no cambien si hay re-renders
  const config = useMemo(() => ({
    initialX: Math.random() * 100,
    initialRotate: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    duration: Math.random() * 10 + 15,
    xOffset: Math.random() * 20 - 10,
    rotateOffset: 360 + (Math.random() * 180)
  }), []);
  
  return (
    <motion.div
      initial={{ 
        y: "-10vh",
        x: `${config.initialX}vw`, 
        opacity: 0,
        rotate: config.initialRotate,
        scale: config.scale
      }}
      animate={{ 
        y: "110vh",
        opacity: [0, 0.8, 0.8, 0],
        x: `${config.initialX + config.xOffset}vw`,
        rotate: config.initialRotate + config.rotateOffset
      }}
      transition={{ 
        duration: config.duration,
        repeat: Infinity, 
        delay: delay,
        ease: "linear"
      }}
      className="absolute pointer-events-none z-0"
    >
      <div 
        className="w-3 h-3 md:w-4 md:h-4 shadow-sm" 
        style={{
           backgroundColor: '#e11d48',
           background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
           borderRadius: '100% 0 100% 0',
           opacity: 0.7
        }}
      />
    </motion.div>
  );
};

export default function App() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  // --- Secuencia de Animación ---
  
  // 1. Apertura (0% - 20%)
  const flapRotate = useTransform(smoothProgress, [0, 0.2], [0, 180]);
  const flapZIndex = useTransform(smoothProgress, [0, 0.19, 0.2], [30, 30, 0]);
  
  // 2. Extracción de la Carta (20% - 100%)
  // FIX: Reduje ligeramente la subida (-80% en vez de -85%)
  // FIX: Ajusté la escala para que termine en 1.0 (tamaño original) en vez de 1.1 (agrandado)
  const letterY = useTransform(smoothProgress, [0.2, 0.8], ["0%", "-80%"]);
  const letterScale = useTransform(smoothProgress, [0.2, 0.8], [0.9, 1.0]); 
  
  // 3. Efecto de Cámara (Pinning)
  // FIX CRITICO: Aumenté drásticamente el desplazamiento hacia abajo (40% en vez de 15%)
  // Esto hace que todo el conjunto baje mientras la carta sale, manteniéndola visible en laptops.
  const envelopeY = useTransform(smoothProgress, [0.2, 0.8], ["0%", "40%"]);

  // 4. UI
  const hintOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const finalMessageOpacity = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);

  // Generamos pétalos
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    const newPetals = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 20
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="relative w-full bg-rose-50">
      <GlobalStyles />
      
      {/* CAPA DE FONDO FIJA 
          FIX: pointer-events-none es CRUCIAL aquí.
          Asegura que si tocas el fondo, el evento de scroll pase al body 
      */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute inset-0 opacity-30 paper-texture"></div>
         {petals.map(p => <FloatingPetal key={p.id} delay={p.delay} />)}
      </div>

      {/* Contenedor de Scroll Alto */}
      <div ref={containerRef} className="h-[400vh] relative z-10 w-full">
        
        {/* STICKY CONTAINER */}
        <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* Título */}
          <motion.div 
            style={{ opacity: hintOpacity }}
            className="absolute top-[8%] md:top-[10%] text-center z-50 w-full px-4"
          >
            <h1 className="font-handwriting text-5xl md:text-7xl lg:text-8xl text-rose-600 mb-2 drop-shadow-sm">
              Para ti...
            </h1>
            <div className="flex flex-col items-center gap-2 text-rose-400">
               <span className="text-sm md:text-base tracking-widest uppercase font-semibold">Desliza suavemente</span>
               <ChevronDown className="animate-bounce" size={24} />
            </div>
          </motion.div>

          {/* EL SOBRE */}
          <motion.div 
            style={{ y: envelopeY }}
            className="relative z-10
                       w-[90vw] max-w-[340px] h-[220px] 
                       md:w-[500px] md:h-[330px] md:max-w-none
                       lg:w-[650px] lg:h-[420px]"
          >
            {/* Wrapper con clip-path */}
            <div 
              className="relative w-full h-full"
              style={{ 
                clipPath: 'inset(-300% -50% 0 -50%)' 
              }}
            >
              
              {/* Parte Trasera */}
              <div className="absolute inset-0 bg-rose-200 rounded-b-xl shadow-2xl border-2 border-rose-300"></div>

              {/* LA CARTA */}
              <motion.div 
                style={{ 
                  y: letterY, 
                  scale: letterScale,
                }}
                className="absolute left-2 right-2 top-2 bottom-0 z-10 origin-top
                           h-[450px] md:h-[550px] lg:h-[650px]
                           bg-white rounded-lg shadow-xl flex flex-col items-center text-center paper-texture"
              >
                <div className="w-full h-full border-4 border-rose-100 border-double rounded-lg p-6 md:p-8 lg:p-12 flex flex-col items-center justify-between">
                  
                  {/* Cabecera Carta */}
                  <div className="flex-none">
                    <div className="mb-2 md:mb-4 text-rose-500 flex justify-center">
                      <Heart size={40} fill="currentColor" className="animate-pulse" />
                    </div>

                    <h2 className="font-handwriting text-3xl md:text-5xl lg:text-6xl text-rose-600 mb-2 md:mb-6">
                      Mi San Valentín
                    </h2>
                  </div>
                  
                  {/* Cuerpo Texto */}
                  <div className="flex-grow flex flex-col justify-center space-y-4 md:space-y-6">
                    <p className="text-base md:text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed">
                      "No necesito un día especial para recordarte cuánto te quiero, pero hoy es la excusa perfecta."
                    </p>
                    <p className="text-base md:text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed">
                      Gracias por ser mi risa favorita, mi mejor abrazo y mi lugar seguro.
                    </p>
                    <p className="text-rose-500 font-handwriting text-3xl md:text-4xl lg:text-5xl pt-4">
                      ¡Te Amo!
                    </p>
                  </div>

                  {/* Pie de Carta */}
                  <div className="flex-none pt-4 md:pt-8 w-full border-t border-rose-100 mt-4">
                    <p className="font-body text-xs md:text-sm text-slate-400 uppercase tracking-widest">
                      14 de Febrero, 2024
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Bolsillo Frontal */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div 
                  className="absolute top-0 left-0 w-full h-full bg-rose-300 rounded-bl-xl shadow-sm"
                  style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}
                ></div>
                <div 
                  className="absolute top-0 right-0 w-full h-full bg-rose-300 rounded-br-xl shadow-sm"
                  style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 w-full h-full bg-rose-400 rounded-b-xl shadow-inner"
                  style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}
                ></div>
              </div>

              {/* Solapa Superior */}
              <motion.div 
                style={{ 
                  rotateX: flapRotate, 
                  zIndex: flapZIndex,
                  transformOrigin: "top"
                }}
                className="absolute top-0 left-0 w-full h-full z-30"
              >
                 <div 
                   className="w-full h-full bg-rose-500 rounded-xl shadow-lg border-t-2 border-rose-400"
                   style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }}
                 ></div>
                 
                 <div className="absolute top-[22%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-700 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-red-800/50">
                      <Heart size={20} className="text-red-200 fill-red-200 md:scale-125" />
                    </div>
                 </div>
              </motion.div>

            </div>
          </motion.div>
          
          {/* Mensaje final */}
          <motion.div 
            style={{ opacity: finalMessageOpacity }}
            className="absolute bottom-[5%] md:bottom-10 z-50"
          >
             <button className="px-6 py-2 md:px-8 md:py-3 bg-rose-500 text-white rounded-full shadow-lg font-semibold hover:bg-rose-600 transition-colors flex items-center gap-2 text-sm md:text-base">
                <Music size={18} /> Nuestra Canción
             </button>
          </motion.div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 h-[20vh] flex items-center justify-center text-rose-300 text-sm">
        Hecho con ♥
      </div>

    </div>
  );
}