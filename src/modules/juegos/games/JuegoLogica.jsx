import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import { useTimeouts } from '@/shared/hooks/useTimeouts';
import { nivelesLogica } from '../data/nivelesLogica';

const MAX_FLECHAS = 12;
const FLECHAS = [
  { id: 'ARRIBA', icono: '⬆️', delta: { x: 0, y: -1 } },
  { id: 'ABAJO', icono: '⬇️', delta: { x: 0, y: 1 } },
  { id: 'IZQUIERDA', icono: '⬅️', delta: { x: -1, y: 0 } },
  { id: 'DERECHA', icono: '➡️', delta: { x: 1, y: 0 } },
];
const porId = Object.fromEntries(FLECHAS.map((f) => [f.id, f]));
const MSG_INICIAL = 'Programa el camino hacia la batería';

const BotonFlecha = ({ flecha, onClick, deshabilitado }) => (
  <motion.button
    whileTap={!deshabilitado ? { scale: 0.9 } : {}} onClick={onClick} disabled={deshabilitado}
    aria-label={`Agregar flecha ${flecha.id.toLowerCase()}`}
    className={`w-full aspect-square rounded-2xl flex items-center justify-center text-3xl md:text-4xl text-white border-4 border-b-8 bg-teal-500 border-teal-700 shadow-sm ${deshabilitado ? 'opacity-50' : 'hover:brightness-110'}`}
  >
    {flecha.icono}
  </motion.button>
);

const JuegoLogica = ({ onAcierto }) => {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [robotPos, setRobotPos] = useState(nivelesLogica[0].inicio);
  const [secuencia, setSecuencia] = useState([]); // ids de flechas
  const [ejecutando, setEjecutando] = useState(false);
  const [mensaje, setMensaje] = useState(MSG_INICIAL);
  const [estado, setEstado] = useState('normal'); // normal | chocando | celebrando
  const corriendo = useRef(false);
  const { programar } = useTimeouts(); // cancela timeouts y voz al salir

  const nivel = nivelesLogica[nivelIdx];
  const esperar = (ms) => new Promise((r) => programar(r, ms)); // no continúa si se desmonta

  const decir = (t) => { setMensaje(t); hablar(t); };

  const agregar = (f) => {
    if (ejecutando || secuencia.length >= MAX_FLECHAS) return;
    setSecuencia((s) => [...s, f.id]);
    hablar(f.id.toLowerCase());
  };
  const borrarUltima = () => { if (!ejecutando) setSecuencia((s) => s.slice(0, -1)); };
  const vaciar = () => { if (!ejecutando) { setSecuencia([]); setMensaje(MSG_INICIAL); } };

  const cargarNivel = (idx) => {
    const n = nivelesLogica[idx];
    setNivelIdx(idx); setRobotPos(n.inicio); setSecuencia([]); setEstado('normal'); setMensaje(MSG_INICIAL);
  };

  const hayObstaculo = (x, y) => nivel.obstaculos.some((o) => o.x === x && o.y === y);

  const ejecutar = async () => {
    if (corriendo.current || !secuencia.length) return;
    corriendo.current = true; setEjecutando(true);
    setEstado('normal'); setRobotPos(nivel.inicio); setMensaje('¡Allá voy!');
    let pos = { ...nivel.inicio };
    await esperar(500);

    for (const id of secuencia) {
      const { delta } = porId[id];
      const sig = { x: pos.x + delta.x, y: pos.y + delta.y };
      const choca = sig.x < 0 || sig.x >= nivel.cols || sig.y < 0 || sig.y >= nivel.filas || hayObstaculo(sig.x, sig.y);
      if (choca) {
        setEstado('chocando');
        decir('Ups, chocamos. Revisa la última flecha.');
        await esperar(1200); // el robot se queda donde chocó: se ve qué pasó
        setRobotPos(nivel.inicio); setEstado('normal');
        corriendo.current = false; setEjecutando(false);
        setSecuencia((s) => s.slice(0, -1));
        return; // la secuencia se borra hasta la última flecha
      }
      pos = sig; setRobotPos(pos);
      await esperar(520);
    }

    if (pos.x === nivel.meta.x && pos.y === nivel.meta.y) {
      setEstado('celebrando');
      decir('¡Batería recargada! Eres genial.');
      onAcierto?.();
      await esperar(3000);
      corriendo.current = false; setEjecutando(false);
      const siguiente = (nivelIdx + 1) % nivelesLogica.length;
      cargarNivel(siguiente);
    } else {
      decir('Casi llegamos. Faltan pasos.');
      await esperar(1500); // se queda donde terminó
      setRobotPos(nivel.inicio);
      corriendo.current = false; setEjecutando(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto flex-1 justify-between py-2">
      <div className="w-full px-2 mb-2 flex items-center gap-3">
        <div aria-live="polite" className="flex-1 bg-teal-100 text-teal-800 px-4 py-3 rounded-[2rem] border-4 border-teal-200 shadow-sm text-center font-extrabold text-base md:text-xl uppercase tracking-wide">
          {mensaje}
        </div>
        <div className="bg-white px-3 py-3 rounded-2xl border-4 border-gray-200 font-bold whitespace-nowrap">
          Nivel <span className="text-teal-600 text-xl">{nivelIdx + 1}</span>/{nivelesLogica.length}
        </div>
      </div>

      {/* Tablero: robot, meta y obstáculos viven DENTRO de cada celda (siempre alineados) */}
      <div className="flex-1 flex items-center justify-center w-full my-2">
        <div className="bg-gray-50 p-3 rounded-[2.5rem] border-8 border-gray-200 shadow-inner">
          <div className="grid gap-2 w-60 h-60 md:w-80 md:h-80" style={{ gridTemplateColumns: `repeat(${nivel.cols}, 1fr)` }}>
            {Array.from({ length: nivel.cols * nivel.filas }).map((_, i) => {
              const x = i % nivel.cols, y = Math.floor(i / nivel.cols);
              const esMeta = x === nivel.meta.x && y === nivel.meta.y;
              const esRobot = x === robotPos.x && y === robotPos.y;
              return (
                <div key={i} className="relative bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-3xl md:text-5xl">
                  {hayObstaculo(x, y) && <span role="img" aria-label="Obstáculo">🪨</span>}
                  {esMeta && <span className="animate-pulse" role="img" aria-label="Batería">🔋</span>}
                  {esRobot && (
                    <motion.span
                      layoutId="robot" transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                      className="absolute inset-0 flex items-center justify-center z-10"
                      role="img" aria-label="Robot"
                    >
                      <motion.span
                        animate={estado === 'chocando' ? { x: [-8, 8, -8, 8, 0] } : estado === 'celebrando' ? { rotate: [0, -20, 20, -20, 20, 0], scale: 1.2 } : { x: 0, rotate: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                      >
                        🤖
                      </motion.span>
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-4 border-gray-200 p-3 rounded-2xl mb-3 shadow-sm flex items-center gap-2 overflow-x-auto min-h-[72px]">
        {secuencia.length === 0 ? (
          <span className="text-gray-400 font-bold text-center w-full uppercase text-sm">Toca las flechas para armar la ruta</span>
        ) : (
          <AnimatePresence>
            {secuencia.map((id, i) => (
              <motion.div key={`${i}-${id}`} layout initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                className="w-11 h-11 flex-shrink-0 bg-teal-50 border-2 border-teal-200 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                {porId[id].icono}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="w-full bg-teal-50 border-t-8 border-teal-100 p-4 md:p-6 rounded-t-[3rem] shadow-inner flex flex-col items-center gap-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-2 w-44 md:w-56">
          <div className="col-start-2"><BotonFlecha flecha={FLECHAS[0]} onClick={() => agregar(FLECHAS[0])} deshabilitado={ejecutando} /></div>
          <div className="col-start-1 row-start-2"><BotonFlecha flecha={FLECHAS[2]} onClick={() => agregar(FLECHAS[2])} deshabilitado={ejecutando} /></div>
          <div className="col-start-2 row-start-2"><BotonFlecha flecha={FLECHAS[1]} onClick={() => agregar(FLECHAS[1])} deshabilitado={ejecutando} /></div>
          <div className="col-start-3 row-start-2"><BotonFlecha flecha={FLECHAS[3]} onClick={() => agregar(FLECHAS[3])} deshabilitado={ejecutando} /></div>
        </div>
        <div className="flex gap-3 w-full max-w-md">
          <motion.button whileTap={{ scale: 0.95 }} onClick={vaciar} disabled={ejecutando || !secuencia.length} aria-label="Vaciar toda la ruta"
            className="py-3 px-4 bg-gray-300 text-gray-700 font-extrabold text-lg rounded-2xl border-b-4 border-gray-400 disabled:opacity-50">🗑️</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={borrarUltima} disabled={ejecutando || !secuencia.length}
            className="flex-1 py-3 bg-red-400 text-white font-extrabold text-lg rounded-2xl border-b-4 border-red-600 disabled:opacity-50">❌ Borrar</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={ejecutar} disabled={ejecutando || !secuencia.length}
            className="flex-1 py-3 bg-green-400 text-white font-extrabold text-xl rounded-2xl border-b-4 border-green-600 disabled:opacity-50">▶️ ¡Ir!</motion.button>
        </div>
      </div>
    </div>
  );
};

export default JuegoLogica;
