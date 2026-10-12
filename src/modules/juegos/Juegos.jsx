import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import { useTimeouts } from '@/shared/hooks/useTimeouts';
import HeaderModulo from '@/shared/components/HeaderModulo';
import Estrellas from '@/shared/components/Estrellas';
import { listaJuegos } from './data/listaJuegos';
import JuegoSombras from './games/JuegoSombras';
import JuegoMemoria from './games/JuegoMemoria';
import JuegoContar from './games/JuegoContar';
import JuegoPatrones from './games/JuegoPatrones';
import JuegoPintor from './games/JuegoPintor';
import JuegoSonidos from './games/JuegoSonidos';
import JuegoLogica from './games/JuegoLogica';

// Para sumar un juego: importarlo y agregar una línea acá (la clave = id de listaJuegos.js).
const COMPONENTES_JUEGO = {
  sombras: JuegoSombras,
  memoria: JuegoMemoria,
  sonidos: JuegoSonidos,
  pintor: JuegoPintor,
  contar: JuegoContar,
  patrones: JuegoPatrones,
  logica: JuegoLogica,
};

const Juegos = ({ usuario, onVolver, progreso }) => {
  const [juegoActivo, setJuegoActivo] = useState(null);
  const [nuevaEstrella, setNuevaEstrella] = useState(false);
  const { programar } = useTimeouts();
  const Juego = juegoActivo ? COMPONENTES_JUEGO[juegoActivo] : null;

  const abrirJuego = (j) => { hablar(`Vamos a jugar a ${j.titulo.toLowerCase()}`); setJuegoActivo(j.id); };

  // Los juegos avisan cada acierto; acá se guarda y se celebra si ganó una estrella
  const alAcierto = () => {
    if (progreso?.registrarAcierto(juegoActivo)) {
      setNuevaEstrella(true);
      hablar('¡Ganaste una estrella!', { interrumpir: false });
      programar(() => setNuevaEstrella(false), 2800);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <HeaderModulo
        titulo={juegoActivo ? '🕹️ Jugando' : '🎮 Sala de Juegos'}
        textoVolver={juegoActivo ? 'Volver al Menú' : 'Volver'}
        onVolver={() => (juegoActivo ? setJuegoActivo(null) : onVolver())}
        usuario={usuario}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-10 relative">
        <AnimatePresence mode="wait">
          {!juegoActivo ? (
            <motion.div key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {listaJuegos.map((j) => (
                <motion.button key={j.id} whileHover={{ scale: 1.03, y: -5 }} whileTap={{ scale: 0.95 }}
                  onClick={() => abrirJuego(j)} aria-label={`${j.titulo}: ${j.desc}`}
                  className={`flex flex-col items-center justify-center p-6 bg-white border-4 border-b-8 rounded-[2.5rem] shadow-sm text-center sm:aspect-square ${j.color}`}>
                  <span className="text-6xl md:text-7xl mb-3">{j.icono}</span>
                  <h2 className={`font-extrabold text-xl md:text-2xl uppercase mb-1 ${j.textCol}`}>{j.titulo}</h2>
                  <p className="text-gray-500 font-bold text-sm leading-tight mb-2">{j.desc}</p>
                  <Estrellas cantidad={progreso?.estrellasJuego(j.id) ?? 0} />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="juego" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full min-h-full bg-white border-4 border-gray-200 rounded-[2.5rem] shadow-inner flex flex-col items-center justify-center p-4 text-center">
              {Juego ? <Juego onAcierto={alAcierto} /> : <p className="text-2xl font-extrabold text-gray-400">🛠️ Próximamente...</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {nuevaEstrella && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
              className="pointer-events-none fixed inset-x-0 top-1/3 flex justify-center z-50"
              role="status"
            >
              <div className="bg-yellow-100 border-8 border-yellow-300 rounded-[3rem] px-10 py-6 shadow-2xl text-center">
                <div className="text-8xl animate-bounce">⭐</div>
                <p className="text-2xl font-extrabold text-yellow-700">¡Nueva estrella!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Juegos;
