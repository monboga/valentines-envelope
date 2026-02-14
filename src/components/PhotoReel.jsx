import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const MY_MEDIA = [
    {
        id: 1,
        type: 'image',
        src: './photos/foto1.jpg',
        caption: 'Nuestro primer recuerdo juntos...'
    },
    {
        id: 2,
        type: 'image',
        src: './photos/foto2.jpeg',
        caption: 'Esa noche donde el tiempo se detuvo.'
    },
    {
        id: 3,
        type: 'image',
        src: './photos/foto3.jpg',
        caption: 'Un 14 de febrero ...'
    },
    {
        id: 4,
        type: 'video',
        src: './photos/video1.mp4',
        caption: 'Nuestro aniversario ...'
    },
    {
        id: 5,
        type: 'image',
        src: './photos/foto4.jpeg',
        caption: 'Y todas las sonrisas que faltan por venir.'
    }
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const variants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 })
};

export default function PhotoReel({ onNext }) {
    const [[page, direction], setPage] = useState([0, 0]);

    // FIX: Ref para bloquear el scroll temporalmente y evitar que salte muchas fotos a la vez
    const scrollTimeout = useRef(null);

    const paginate = (newDirection) => {
        const nextIndex = page + newDirection;
        if (nextIndex < 0) return;
        if (nextIndex >= MY_MEDIA.length) {
            onNext();
            return;
        }
        setPage([nextIndex, newDirection]);
    };

    // FIX: Función que detecta la rueda del ratón / trackpad
    const handleWheel = (e) => {
        // Ignoramos movimientos ultra pequeños del trackpad
        if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) < 20) return;

        // Si estamos en "cooldown", no hacemos nada
        if (scrollTimeout.current) return;

        if (e.deltaY > 0 || e.deltaX > 0) {
            paginate(1); // Scroll abajo/derecha
        } else if (e.deltaY < 0 || e.deltaX < 0) {
            paginate(-1); // Scroll arriba/izquierda
        }

        // Bloqueamos nuevos eventos de scroll por 1 segundo para ver la animación
        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            // FIX: Añadimos onWheel aquí
            onWheel={handleWheel}
            className="fixed inset-0 flex flex-col items-center justify-center w-full h-full z-50 bg-zinc-950 overflow-hidden touch-none"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-[8%] text-center w-full px-4 z-20 pointer-events-none"
            >
                <h2 className="font-handwriting text-4xl md:text-5xl text-rose-300 drop-shadow-md">
                    Nuestra historia en cuadros...
                </h2>
            </motion.div>

            {/* Actualizamos el texto del hint para reflejar que se puede hacer scroll o deslizar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 2, duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="absolute top-[18%] md:top-[20%] flex items-center gap-2 text-zinc-400 font-body text-xs md:text-sm z-20 pointer-events-none uppercase tracking-widest text-center px-4"
            >
                <ChevronLeft size={16} className="hidden md:block" />
                Desliza  a la derecha o izquierda para ver nuestra historia
                <ChevronRight size={16} className="hidden md:block" />
            </motion.div>

            <div className="relative w-[85vw] max-w-[400px] aspect-[4/5] md:aspect-square mt-8">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) paginate(1);
                            else if (swipe > swipeConfidenceThreshold) paginate(-1);
                        }}
                        className="absolute inset-0 flex flex-col items-center cursor-grab active:cursor-grabbing"
                    >
                        <div className="w-full h-full p-4 pb-0 bg-white rounded-sm shadow-2xl flex flex-col pointer-events-none">
                            <div className="relative flex-grow w-full overflow-hidden bg-zinc-200">

                                {MY_MEDIA[page].type === 'video' ? (
                                    <video
                                        src={MY_MEDIA[page].src}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        // pointer-events-none es vital para que el drag/swipe siga funcionando
                                        className="w-full h-full object-cover select-none pointer-events-none"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<span class="flex h-full items-center justify-center text-zinc-400 font-body text-center px-2">Video no encontrado</span>';
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={MY_MEDIA[page].src}
                                        alt={MY_MEDIA[page].caption}
                                        className="w-full h-full object-cover select-none pointer-events-none"
                                        draggable="false"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<span class="flex h-full items-center justify-center text-zinc-400 font-body text-center px-2">Pon tus fotos/videos en la carpeta public/photos/</span>';
                                        }}
                                    />
                                )}
                            </div>
                            <div className="h-20 md:h-24 flex items-center justify-center">
                                <p className="font-handwriting text-3xl md:text-4xl text-zinc-800 text-center leading-none">
                                    {MY_MEDIA[page].caption}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-[10%] flex flex-col items-center gap-6 z-20 pointer-events-none">
                <div className="flex gap-2">
                    {MY_MEDIA.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === page ? 'w-8 bg-rose-400' : 'w-2 bg-zinc-600'}`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}