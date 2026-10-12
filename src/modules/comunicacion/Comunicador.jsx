import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import HeaderModulo from '@/shared/components/HeaderModulo';
import { useTarjetasPersonalizadas } from '@/shared/hooks/useTarjetasPersonalizadas';
import { categorias, diccionario } from './data/diccionario';

const crearIdUnico = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `frase_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const Comunicador = ({ usuario, onVolver }) => {
  const [categoriaActiva, setCategoriaActiva] = useState('basicos');
  const [frase, setFrase] = useState([]);
  const [creando, setCreando] = useState(false);
  const [nuevaTarjeta, setNuevaTarjeta] = useState({ icono: '', texto: '' });
  const {
    tarjetasPersonalizadas,
    agregarTarjetaPersonalizada,
    eliminarTarjetaPersonalizada,
  } = useTarjetasPersonalizadas('tecnopuentes_tarjetas_comunicacion');
  const tarjetas = [...(diccionario[categoriaActiva] ?? []), ...(tarjetasPersonalizadas[categoriaActiva] ?? [])];

  const agregarTarjeta = (t) => {
    hablar(t.voz ?? t.texto);
    setFrase((prev) => [...prev, { ...t, uniqueId: crearIdUnico() }]);
  };
  const eliminarTarjeta = (uid) => setFrase((prev) => prev.filter((t) => t.uniqueId !== uid));
  const leerFrase = () => { if (frase.length) hablar(frase.map((t) => t.voz ?? t.texto).join(' ')); };
  const guardarTarjeta = (e) => {
    e.preventDefault();
    agregarTarjetaPersonalizada(categoriaActiva, nuevaTarjeta);
    setNuevaTarjeta({ icono: '', texto: '' });
    setCreando(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <HeaderModulo titulo="TecnoPuentes" onVolver={onVolver} usuario={usuario} />

      <div className="bg-white p-4 shadow-md border-b-4 border-gray-200 z-10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-blue-50/50 border-4 border-dashed border-blue-200 rounded-3xl p-4 flex gap-3 overflow-x-auto min-h-[120px] items-center">
          {frase.length === 0 ? (
            <span className="text-gray-400 font-bold text-lg w-full text-center">Toca las tarjetas para armar una frase...</span>
          ) : (
            <AnimatePresence>
              {frase.map((t) => (
                <motion.button
                  layout key={t.uniqueId}
                  initial={{ opacity: 0, scale: 0.5, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  onClick={() => eliminarTarjeta(t.uniqueId)} aria-label={`Quitar ${t.texto}`}
                  className="flex flex-col items-center justify-center min-w-[90px] h-[90px] bg-white border-4 border-gray-200 rounded-2xl shadow-sm hover:border-red-300 shrink-0"
                >
                  <span className="text-3xl mb-1">{t.icono}</span>
                  <span className="font-extrabold text-xs text-gray-700 uppercase">{t.texto}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
        <div className="flex md:flex-col gap-3 justify-center">
          <motion.button whileTap={{ scale: 0.92 }} onClick={leerFrase} disabled={!frase.length}
            className="flex-1 md:flex-none p-4 bg-green-400 text-white rounded-2xl border-b-4 border-green-600 shadow-md font-bold text-2xl disabled:opacity-50">🔊 Leer</motion.button>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setFrase([])} disabled={!frase.length}
            className="flex-1 md:flex-none p-4 bg-red-400 text-white rounded-2xl border-b-4 border-red-600 shadow-md font-bold text-2xl disabled:opacity-50">❌ Borrar</motion.button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="flex md:flex-col gap-3 p-4 bg-white border-r-4 border-gray-100 overflow-x-auto md:w-64 shrink-0 custom-scrollbar">
          {categorias.map((cat) => (
            <motion.button key={cat.id} whileTap={{ scale: 0.95 }} onClick={() => setCategoriaActiva(cat.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-4 transition-all shrink-0 md:w-full text-left ${categoriaActiva === cat.id ? cat.color + ' shadow-md scale-105' : 'border-transparent bg-gray-50 text-gray-500 hover:border-gray-200'}`}>
              <span className="text-3xl">{cat.icono}</span>
              <span className="font-extrabold uppercase text-sm md:text-base">{cat.texto}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="mb-5 flex flex-col gap-3 rounded-3xl border-4 border-dashed border-blue-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider text-blue-500">Categoría activa</p>
              <h2 className="text-xl font-extrabold text-gray-700">{categorias.find((cat) => cat.id === categoriaActiva)?.texto}</h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCreando((actual) => !actual)}
              className="rounded-2xl bg-blue-500 px-5 py-3 text-lg font-extrabold text-white shadow-md"
            >
              {creando ? 'Cerrar' : '➕ Agregar tarjeta'}
            </motion.button>
          </div>

          <AnimatePresence>
            {creando && (
              <motion.form
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                onSubmit={guardarTarjeta}
                className="mb-6 grid gap-3 rounded-3xl border-4 border-blue-100 bg-blue-50/70 p-4 md:grid-cols-[8rem_1fr_auto]"
              >
                <input
                  value={nuevaTarjeta.icono}
                  onChange={(e) => setNuevaTarjeta((actual) => ({ ...actual, icono: e.target.value }))}
                  placeholder="⭐"
                  aria-label="Pictograma de la tarjeta"
                  className="min-h-16 rounded-2xl border-4 border-white bg-white p-3 text-center text-3xl font-extrabold text-gray-700 outline-none focus:border-blue-300"
                />
                <input
                  value={nuevaTarjeta.texto}
                  onChange={(e) => setNuevaTarjeta((actual) => ({ ...actual, texto: e.target.value }))}
                  placeholder="Texto de la tarjeta"
                  aria-label="Texto de la tarjeta"
                  className="min-h-16 rounded-2xl border-4 border-white bg-white p-3 text-xl font-extrabold uppercase text-gray-700 outline-none focus:border-blue-300"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!nuevaTarjeta.texto.trim()}
                  className="min-h-16 rounded-2xl bg-green-500 px-6 text-xl font-extrabold text-white shadow-md disabled:opacity-50"
                >
                  Guardar
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div key={categoriaActiva} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tarjetas.map((t) => (
              <div key={t.id} className="relative">
                {t.personalizada && (
                  <button
                    type="button"
                    onClick={() => eliminarTarjetaPersonalizada(categoriaActiva, t.id)}
                    aria-label={`Eliminar ${t.texto}`}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-extrabold text-red-600 shadow-sm"
                  >
                    ×
                  </button>
                )}
                <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.92 }}
                  onClick={() => agregarTarjeta(t)} aria-label={t.texto}
                  className={`flex aspect-square w-full flex-col items-center justify-center rounded-[2rem] border-4 border-b-8 bg-white p-6 shadow-sm hover:border-blue-300 ${t.personalizada ? 'border-blue-200' : 'border-gray-200'}`}>
                  <span className="mb-4 text-6xl">{t.icono}</span>
                  <span className="text-center text-lg font-extrabold uppercase leading-tight text-gray-700">{t.texto}</span>
                </motion.button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Comunicador;
