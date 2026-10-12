import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hablar } from '@/shared/voz';
import HeaderModulo from '@/shared/components/HeaderModulo';
import { useTarjetasPersonalizadas } from '@/shared/hooks/useTarjetasPersonalizadas';
import { categorias } from './data/categorias';
import { baseDatosEducacion } from './data/baseDatosEducacion';

const Educacion = ({ usuario, onVolver }) => {
  const [categoriaActiva, setCategoriaActiva] = useState('vocales');
  const [creando, setCreando] = useState(false);
  const [nuevaTarjeta, setNuevaTarjeta] = useState({ icono: '', texto: '' });
  const {
    tarjetasPersonalizadas,
    agregarTarjetaPersonalizada,
    eliminarTarjetaPersonalizada,
  } = useTarjetasPersonalizadas('tecnopuentes_tarjetas_educacion');
  const tarjetas = [...(baseDatosEducacion[categoriaActiva] || []), ...(tarjetasPersonalizadas[categoriaActiva] ?? [])];
  const guardarTarjeta = (e) => {
    e.preventDefault();
    agregarTarjetaPersonalizada(categoriaActiva, nuevaTarjeta);
    setNuevaTarjeta({ icono: '', texto: '' });
    setCreando(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <HeaderModulo titulo="📚 Módulo de Educación" onVolver={onVolver} usuario={usuario} />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="flex md:flex-col gap-3 p-4 bg-white border-r-4 border-gray-100 overflow-x-auto md:w-72 shrink-0 md:overflow-y-auto custom-scrollbar">
          {categorias.map((cat) => (
            <motion.button
              key={cat.id} whileTap={{ scale: 0.95 }}
              onClick={() => { setCategoriaActiva(cat.id); hablar(cat.texto); }}
              aria-label={cat.texto} aria-pressed={categoriaActiva === cat.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all shrink-0 md:w-full text-left ${categoriaActiva === cat.id ? cat.color + ' shadow-md scale-105' : 'border-transparent bg-gray-50 text-gray-500 hover:border-gray-200'}`}
            >
              <span className="text-3xl">{cat.icono}</span>
              <span className="font-extrabold text-sm md:text-base whitespace-nowrap md:whitespace-normal">{cat.texto}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="mb-5 flex flex-col gap-3 rounded-3xl border-4 border-dashed border-purple-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider text-purple-500">Categoría activa</p>
              <h2 className="text-xl font-extrabold text-gray-700">{categorias.find((cat) => cat.id === categoriaActiva)?.texto}</h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCreando((actual) => !actual)}
              className="rounded-2xl bg-purple-500 px-5 py-3 text-lg font-extrabold text-white shadow-md"
            >
              {creando ? 'Cerrar' : '➕ Agregar tarjeta'}
            </motion.button>
          </div>

          <AnimatePresence>
            {creando && (
              <motion.form
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                onSubmit={guardarTarjeta}
                className="mb-6 grid gap-3 rounded-3xl border-4 border-purple-100 bg-purple-50/70 p-4 md:grid-cols-[8rem_1fr_auto]"
              >
                <input
                  value={nuevaTarjeta.icono}
                  onChange={(e) => setNuevaTarjeta((actual) => ({ ...actual, icono: e.target.value }))}
                  placeholder="⭐"
                  aria-label="Pictograma de la tarjeta"
                  className="min-h-16 rounded-2xl border-4 border-white bg-white p-3 text-center text-3xl font-extrabold text-gray-700 outline-none focus:border-purple-300"
                />
                <input
                  value={nuevaTarjeta.texto}
                  onChange={(e) => setNuevaTarjeta((actual) => ({ ...actual, texto: e.target.value }))}
                  placeholder="Texto de la tarjeta"
                  aria-label="Texto de la tarjeta"
                  className="min-h-16 rounded-2xl border-4 border-white bg-white p-3 text-xl font-extrabold text-gray-700 outline-none focus:border-purple-300"
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

          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {tarjetas.length ? tarjetas.map((t) => (
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
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.92 }}
                    onClick={() => hablar(t.voz ?? t.texto)} aria-label={t.texto}
                    className={`flex aspect-square w-full flex-col items-center justify-center rounded-[2rem] border-4 border-b-8 bg-white p-4 shadow-sm hover:border-blue-400 md:p-6 ${t.personalizada ? 'border-purple-200' : 'border-gray-200'}`}
                  >
                    <span className="mb-3 text-5xl md:text-7xl">{t.icono}</span>
                    <span className="text-center text-base font-extrabold leading-tight text-gray-700 md:text-xl">{t.texto}</span>
                  </motion.button>
                </div>
              )) : (
                <div className="col-span-full flex flex-col items-center text-gray-400 p-10">
                  <span className="text-6xl mb-4">🛠️</span>
                  <h3 className="text-2xl font-bold">Categoría en construcción</h3>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Educacion;
