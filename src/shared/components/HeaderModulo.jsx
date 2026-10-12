import { motion } from 'motion/react';
import Avatar from './Avatar';

const HeaderModulo = ({ titulo, onVolver, textoVolver = 'Volver', usuario }) => (
  <header className="flex justify-between items-center p-4 bg-white border-b-4 border-gray-200 shadow-sm z-20">
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onVolver}
        className="p-3 bg-gray-100 text-gray-600 rounded-2xl border-b-4 border-gray-300 font-bold hover:bg-gray-200"
      >
        ⬅️ {textoVolver}
      </motion.button>
      <h1 className="text-2xl font-extrabold text-blue-500 hidden md:block">{titulo}</h1>
    </div>
    {usuario && (
      <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border-2 border-blue-100">
        <Avatar id={usuario.avatar} />
        <span className="font-bold text-gray-700 text-lg">{usuario.nombre}</span>
      </div>
    )}
  </header>
);

export default HeaderModulo;
