import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import { mezclar } from '@/shared/utils/mezclar';
import { useTimeouts } from '@/shared/hooks/useTimeouts';
import { elementos } from '@/shared/data/elementos';

const PARES = 4;

const JuegoMemoria = ({ onAcierto, onTerminar }) => {
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [emparejadas, setEmparejadas] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);
  const { programar } = useTimeouts();

  const iniciarJuego = () => {
    const elegidos = mezclar(elementos).slice(0, PARES);
    setCartas(mezclar([...elegidos, ...elegidos]).map((e, i) => ({ ...e, uid: i })));
    setVolteadas([]);
    setEmparejadas([]);
    setBloqueado(false);
    hablar('Encuentra las parejas iguales');
  };

  useEffect(() => { iniciarJuego(); }, []); // eslint-disable-line

  const mostrada = (i) => volteadas.includes(i) || emparejadas.includes(cartas[i].id);
  const gano = cartas.length > 0 && emparejadas.length === PARES;

  const tocar = (i) => {
    if (bloqueado || mostrada(i)) return;
    hablar(cartas[i].texto);
    const nuevas = [...volteadas, i];
    setVolteadas(nuevas);
    if (nuevas.length < 2) return;

    setBloqueado(true);
    const [a, b] = nuevas;
    if (cartas[a].id === cartas[b].id) {
      programar(() => {
        setEmparejadas((prev) => [...prev, cartas[a].id]);
        setVolteadas([]);
        setBloqueado(false);
        onAcierto?.();
        hablar('¡Muy bien! Son iguales.');
      }, 500);
    } else {
      programar(() => {
        setVolteadas([]);
        setBloqueado(false);
      }, 1200);
    }
  };

  useEffect(() => {
    if (gano) {
      programar(() => hablar('¡Excelente! Encontraste todas las parejas.'), 900);
      onTerminar?.();
    }
  }, [gano]); // eslint-disable-line

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto flex-1 justify-between py-4">
      <div className="bg-purple-100 text-purple-700 px-6 py-4 rounded-[2rem] border-4 border-purple-200 shadow-sm">
        <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-center">
          {gano ? '¡Lo lograste!' : 'Encuentra las parejas'}
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center w-full my-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full max-w-2xl px-2">
          {cartas.map((carta, i) => {
            const abierta = mostrada(i);
            const resuelta = emparejadas.includes(carta.id);
            return (
              <motion.button
                key={carta.uid}
                onClick={() => tocar(i)}
                aria-label={abierta ? `Carta: ${carta.texto}` : 'Carta boca abajo'}
                className="relative w-full aspect-square"
                style={{ perspective: 1000 }}
                whileHover={!abierta && !bloqueado ? { scale: 1.05 } : {}}
                whileTap={!abierta && !bloqueado ? { scale: 0.95 } : {}}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotateY: abierta ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 210, damping: 18 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 bg-purple-400 border-4 border-b-8 border-purple-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-sm"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                    <span className="text-3xl sm:text-5xl text-white opacity-60">❓</span>
                  </div>
                  <div className={`absolute inset-0 border-4 border-b-8 rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-md ${resuelta ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <span className="text-4xl sm:text-6xl md:text-7xl">{carta.icono}</span>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[72px]">
        <AnimatePresence>
          {gano && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50 }}
              whileTap={{ scale: 0.95 }} onClick={iniciarJuego}
              className="px-8 py-4 bg-green-400 text-white text-2xl font-extrabold rounded-[2rem] border-b-8 border-green-600 shadow-lg"
            >
              ¡Jugar de nuevo! 🔄
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JuegoMemoria;
