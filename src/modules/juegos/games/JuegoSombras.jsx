import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import { mezclar } from '@/shared/utils/mezclar';
import { useTimeouts } from '@/shared/hooks/useTimeouts';
import { elementos, conArticulo, conArticuloDe } from '@/shared/data/elementos';

const JuegoSombras = ({ onAcierto }) => {
  const [ronda, setRonda] = useState(0);
  const [objetivo, setObjetivo] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [ganador, setGanador] = useState(false);
  const [errorId, setErrorId] = useState(null);
  const bloqueado = useRef(false);
  const anterior = useRef(null);
  const { programar } = useTimeouts();

  const generarRonda = () => {
    setGanador(false);
    setErrorId(null);
    bloqueado.current = false;

    const candidatos = elementos.filter((e) => e.id !== anterior.current);
    const nuevo = mezclar(candidatos)[0];
    anterior.current = nuevo.id;

    const distractores = mezclar(elementos.filter((e) => e.id !== nuevo.id)).slice(0, 2);
    setObjetivo(nuevo);
    setOpciones(mezclar([nuevo, ...distractores]));
    setRonda((r) => r + 1);
    hablar('Busca la sombra y toca la respuesta correcta');
  };

  useEffect(() => { generarRonda(); }, []); // eslint-disable-line

  const verificar = (item) => {
    if (bloqueado.current) return;
    if (item.id === objetivo.id) {
      bloqueado.current = true;
      setGanador(true);
      hablar(`¡Muy bien! Es ${conArticulo(item)}.`);
      onAcierto?.();
      programar(generarRonda, 2200);
    } else {
      setErrorId(item.id);
      programar(() => setErrorId(null), 650);
    }
  };

  if (!objetivo) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto flex-1 justify-between py-4">
      <div className="bg-blue-100 text-blue-700 px-6 py-4 rounded-[2rem] border-4 border-blue-200 shadow-sm">
        <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-center">¿De quién es esta sombra?</h2>
      </div>

      <div className="flex-1 flex items-center justify-center w-full my-6">
        <div className="relative flex items-center justify-center w-52 h-52 md:w-64 md:h-64 bg-gray-50 border-8 border-dashed border-gray-300 rounded-[3rem] shadow-inner">
          <motion.div
            key={`${ronda}-${ganador ? 'color' : 'sombra'}`}
            initial={ganador ? { scale: 0.7, opacity: 0.4, filter: 'grayscale(1) brightness(0.3)' } : { opacity: 0.2, filter: 'grayscale(1) brightness(0.15)' }}
            animate={ganador ? { scale: [0.9, 1.2, 1], opacity: 1, filter: 'grayscale(0) brightness(1.15)' } : { opacity: 1, filter: 'grayscale(1) brightness(0.15)' }}
            transition={{ type: 'spring', stiffness: 170, damping: 12 }}
            className={`text-8xl md:text-9xl ${ganador ? 'drop-shadow-[0_12px_18px_rgba(34,197,94,0.25)]' : 'drop-shadow-[0_12px_20px_rgba(15,23,42,0.18)]'}`}
            aria-label={ganador ? objetivo.texto : 'Sombra'}
          >
            {objetivo.icono}
          </motion.div>

          {ganador && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0 border-8 border-green-400 rounded-[3rem]"
            />
          )}
        </div>
      </div>

      <div className="w-full bg-blue-50 border-t-8 border-blue-100 p-4 md:p-8 rounded-t-[3rem] shadow-inner">
        <div className="flex justify-center gap-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {opciones.map((item) => {
              const correcto = ganador && item.id === objetivo.id;
              const error = errorId === item.id;
              return (
                <motion.button
                  key={`${ronda}-${item.id}`} layout
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={
                    error
                      ? { x: [-10, 10, -8, 8, 0], rotate: [0, -1.2, 1.2, 0] }
                      : correcto
                        ? { opacity: 1, scale: [1, 1.12, 1], y: [-6, 0] }
                        : { opacity: 1, scale: 1, y: 0, x: 0 }
                  }
                  exit={{ opacity: 0, scale: 0, y: -50 }}
                  whileHover={!ganador ? { scale: 1.05 } : {}} whileTap={!ganador ? { scale: 0.92 } : {}}
                  onClick={() => verificar(item)} aria-label={item.texto}
                  className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white border-4 border-b-8 border-gray-200 hover:border-blue-300 rounded-3xl shadow-sm"
                  style={{ pointerEvents: correcto || ganador ? 'none' : 'auto' }}
                >
                  <span className="text-5xl sm:text-6xl md:text-7xl">{item.icono}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JuegoSombras;
