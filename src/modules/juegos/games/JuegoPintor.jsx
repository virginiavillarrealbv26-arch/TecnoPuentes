import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { hablar, callar } from '@/shared/voz';
import { dibujos, colores } from '../data/dibujos';

const TAGS = { rect: motion.rect, circle: motion.circle, polygon: motion.polygon, ellipse: motion.ellipse };

const rellenoInicial = (dibujo) =>
  Object.fromEntries(dibujo.zonas.map((z) => [z.id, z.fondo ?? '#FFFFFF']));

const JuegoPintor = () => {
  const [dibujo, setDibujo] = useState(dibujos[0]);
  const [colorActivo, setColorActivo] = useState(null);
  const [rellenos, setRellenos] = useState(() => rellenoInicial(dibujos[0]));
  const [historial, setHistorial] = useState([]);
  const yaPintadas = useRef(new Set());

  useEffect(() => callar, []);

  const cambiarDibujo = (d) => {
    setDibujo(d); setRellenos(rellenoInicial(d)); setHistorial([]); yaPintadas.current = new Set();
    hablar(d.titulo);
  };

  const elegirColor = (c) => { setColorActivo(c); hablar(c.nombre); };

  const pintar = (zona) => {
    if (!colorActivo) { hablar('Primero elige un color de abajo'); return; }
    setHistorial((h) => [...h, rellenos]);
    setRellenos((prev) => ({ ...prev, [zona.id]: colorActivo.hex }));
    if (!yaPintadas.current.has(zona.id)) {
      yaPintadas.current.add(zona.id);
      hablar(`Pintaste ${zona.nombre} de ${colorActivo.nombre.toLowerCase()}`);
    }
  };

  const deshacer = () => {
    if (!historial.length) return;
    setRellenos(historial[historial.length - 1]);
    setHistorial((h) => h.slice(0, -1));
  };

  const borrarTodo = () => {
    setRellenos(rellenoInicial(dibujo)); setHistorial([]); setColorActivo(null);
    yaPintadas.current = new Set();
    hablar('Lienzo en blanco');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto flex-1 justify-between py-4">
      <div className="flex items-center justify-between w-full px-2 gap-2">
        <div className="bg-pink-100 text-pink-700 px-4 py-3 rounded-[2rem] border-4 border-pink-200 shadow-sm flex-1">
          <h2 className="text-lg md:text-2xl font-extrabold uppercase tracking-wider text-center">¡Toca un color y pinta!</h2>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={deshacer} disabled={!historial.length} aria-label="Deshacer"
          className="bg-gray-100 text-gray-600 px-3 py-3 rounded-2xl border-b-4 border-gray-300 font-bold disabled:opacity-40">
          ↩️<span className="hidden sm:inline"> Deshacer</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={borrarTodo} aria-label="Borrar todo"
          className="bg-gray-100 text-gray-600 px-3 py-3 rounded-2xl border-b-4 border-gray-300 font-bold">
          🗑️<span className="hidden sm:inline"> Borrar</span>
        </motion.button>
      </div>

      <div className="flex gap-3 my-3">
        {dibujos.map((d) => (
          <motion.button key={d.id} whileTap={{ scale: 0.92 }} onClick={() => cambiarDibujo(d)} aria-pressed={dibujo.id === d.id}
            className={`px-4 py-2 rounded-2xl border-4 font-extrabold ${dibujo.id === d.id ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 bg-white text-gray-500'}`}>
            {d.icono} {d.titulo}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md aspect-square bg-white border-8 border-gray-200 rounded-[2rem] md:rounded-[3rem] shadow-inner overflow-hidden touch-none">
          <svg viewBox="0 0 200 200" className="w-full h-full" role="group" aria-label={`Dibujo: ${dibujo.titulo}`}>
            {dibujo.zonas.map((z) => {
              const Forma = TAGS[z.tag];
              return (
                <Forma
                  key={`${dibujo.id}-${z.id}`} {...z.props}
                  animate={{ fill: rellenos[z.id] }} transition={{ duration: 0.35, ease: 'easeInOut' }}
                  onClick={() => pintar(z)}
                  role="button" tabIndex={0} aria-label={`Pintar ${z.nombre}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pintar(z); } }}
                  style={{ cursor: 'pointer', pointerEvents: 'all', outline: 'none' }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="w-full bg-pink-50 border-t-8 border-pink-100 p-4 md:p-6 rounded-t-[3rem] shadow-inner mt-3">
        <div className="flex flex-wrap justify-center gap-3 md:gap-5">
          {colores.map((c) => {
            const activo = colorActivo?.id === c.id;
            return (
              <div key={c.id} className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => elegirColor(c)}
                  style={{ backgroundColor: c.hex }} aria-label={`Seleccionar color ${c.nombre}`} aria-pressed={activo}
                  className={`relative w-14 h-14 md:w-20 md:h-20 rounded-full border-4 shadow-sm flex items-center justify-center text-3xl md:text-4xl text-white ${activo ? 'border-gray-800 ring-4 ring-gray-800/30 scale-110' : 'border-white'}`}
                >
                  {activo && <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl">●</span>}
                </motion.button>
                <span className="text-xs md:text-sm font-extrabold text-gray-700 mt-1">{c.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JuegoPintor;
