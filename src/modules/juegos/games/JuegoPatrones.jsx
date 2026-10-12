import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import { mezclar } from '@/shared/utils/mezclar';
import { useTimeouts } from '@/shared/hooks/useTimeouts';

const POOL = [
  { id: 'manzana', icono: '🍎', texto: 'Manzana' },
  { id: 'banana', icono: '🍌', texto: 'Banana' },
  { id: 'perro', icono: '🐶', texto: 'Perro' },
  { id: 'gato', icono: '🐱', texto: 'Gato' },
  { id: 'circulo', icono: '🔴', texto: 'Círculo rojo' },
  { id: 'cuadrado', icono: '🟦', texto: 'Cuadrado azul' },
];

const PATRONES = [
  { tipo: 'ABAB', visibles: ['A', 'B', 'A', 'B'], respuesta: 'A' },
  { tipo: 'AAB', visibles: ['A', 'A', 'B', 'A', 'A'], respuesta: 'B' },
  { tipo: 'ABC', visibles: ['A', 'B', 'C', 'A', 'B'], respuesta: 'C' },
];

const JuegoPatrones = ({ onAcierto }) => {
  const [ronda, setRonda] = useState(0);
  const [secuencia, setSecuencia] = useState([]);
  const [objetivo, setObjetivo] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [ganador, setGanador] = useState(false);
  const [errorId, setErrorId] = useState(null);
  const [pistaHueco, setPistaHueco] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const bloqueado = useRef(false);
  const tipoAnterior = useRef(null);
  const { programar } = useTimeouts();

  const generarRonda = () => {
    bloqueado.current = false;
    setGanador(false);
    setErrorId(null);
    setPistaHueco(false);
    setReproduciendo(true);
    setRonda((r) => r + 1);

    const patron = mezclar(PATRONES.filter((p) => p.tipo !== tipoAnterior.current))[0];
    tipoAnterior.current = patron.tipo;

    const [A, B, C, D] = mezclar(POOL);
    const mapa = { A, B, C };
    const visibles = patron.visibles.map((l) => mapa[l]);
    const correcta = mapa[patron.respuesta];

    const delPatron = [...new Set(visibles)].find((e) => e.id !== correcta.id);
    const ajeno = patron.tipo === 'ABC' ? D : C;

    setSecuencia(visibles);
    setObjetivo(correcta);
    setOpciones(mezclar([correcta, delPatron, ajeno]));

    const secuenciaLeida = visibles.map((e) => e.texto).join(', ');
    hablar(`Mira la secuencia: ${secuenciaLeida}. ¿Qué sigue?`, { velocidad: 0.82 });

    programar(() => setReproduciendo(false), 1800);
  };

  useEffect(() => { generarRonda(); }, []); // eslint-disable-line

  const verificar = (item) => {
    if (bloqueado.current || reproduciendo) return;
    if (item.id === objetivo.id) {
      bloqueado.current = true;
      setGanador(true);
      const completa = [...secuencia, item].map((e) => e.texto).join(', ');
      hablar(`¡Perfecto! La secuencia completa es: ${completa}.`, { velocidad: 0.8 });
      onAcierto?.();
      programar(generarRonda, 3200);
    } else {
      setErrorId(item.id);
      setPistaHueco(true);
      programar(() => { setErrorId(null); setPistaHueco(false); }, 650);
    }
  };

  if (!objetivo) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto flex-1 justify-between py-4">
      <div className="bg-orange-100 text-orange-700 px-8 py-4 rounded-[2rem] border-4 border-orange-200 shadow-sm">
        <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-center">¿Qué sigue?</h2>
      </div>

      <div className="flex-1 flex items-center justify-center w-full my-6 px-1">
        <div
          role="img"
          aria-label={`Patrón: ${secuencia.map((e) => e.texto).join(', ')}, ¿qué sigue?`}
          className="flex flex-nowrap justify-center gap-1 sm:gap-3 bg-gray-50 p-3 sm:p-6 rounded-[2rem] md:rounded-[3rem] border-8 border-gray-200 shadow-inner"
        >
          {[...secuencia, null].map((item, i) => {
            const hueco = item === null;
            const cls = !hueco
              ? 'bg-white border-4 border-b-8 border-gray-200'
              : ganador ? 'bg-white border-4 border-b-8 border-green-400'
              : pistaHueco ? 'bg-orange-50 border-4 border-dashed border-orange-400'
              : 'bg-gray-100 border-4 border-dashed border-gray-400';
            return (
              <motion.div
                key={`${ronda}-${i}`}
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, type: 'spring' }}
                className={`flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl shadow-sm ${cls}`}
              >
                {!hueco && <span className="text-3xl sm:text-5xl md:text-6xl">{item.icono}</span>}
                {hueco && ganador && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="text-3xl sm:text-5xl md:text-6xl">
                    {objetivo.icono}
                  </motion.span>
                )}
                {hueco && !ganador && <span className="text-2xl sm:text-4xl text-gray-400">?</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-full bg-orange-50 border-t-8 border-orange-100 p-4 md:p-8 rounded-t-[3rem] shadow-inner">
        <div className="flex justify-center gap-3 md:gap-8">
          <AnimatePresence mode="popLayout">
            {opciones.map((item) => {
              const oculta = ganador && item.id !== objetivo.id;
              const error = errorId === item.id;
              return (
                <motion.button
                  key={`${ronda}-${item.id}`} layout
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={error ? { x: [-10, 10, -8, 8, 0] } : oculta ? { opacity: 0 } : { opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0, y: -50 }}
                  whileHover={!reproduciendo && !ganador ? { scale: 1.05 } : {}} whileTap={!reproduciendo && !ganador ? { scale: 0.9 } : {}}
                  onClick={() => verificar(item)} aria-label={item.texto}
                  style={{ pointerEvents: oculta || reproduciendo ? 'none' : 'auto' }}
                  className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-white border-4 border-b-8 border-gray-200 hover:border-orange-300 rounded-3xl shadow-sm"
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

export default JuegoPatrones;
