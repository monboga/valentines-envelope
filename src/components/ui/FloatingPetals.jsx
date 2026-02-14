import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function FloatingPetals({ delay }) {
  // Los cálculos de física de la caída se mantienen intactos
  const config = useMemo(() => ({
    initialX: Math.random() * 100,
    initialRotate: Math.random() * 360,
    // Ajusté ligeramente la escala para que las imágenes se vean de buen tamaño
    scale: 0.6 + Math.random() * 0.6, 
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
      {/* EL REFACTOR: Usamos la etiqueta <img> en lugar del div con gradientes */}
      <img 
        src="./photos/red-petal.png" 
        alt="Pétalo cayendo"
        // Aumenté el tamaño base (w-6 a w-10) porque las imágenes suelen necesitar 
        // más área que un div de color sólido. Usa drop-shadow para respetar la transparencia.
        className="w-6 h-6 md:w-10 md:h-10 object-contain drop-shadow-md opacity-80" 
        draggable="false"
        onError={(e) => {
           // Fallback silencioso: si la ruta falla, simplemente oculta ese pétalo 
           // para no mostrar el ícono de "imagen rota" del navegador.
           e.target.style.display = 'none';
        }}
      />
    </motion.div>
  );
}