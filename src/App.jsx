import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useUsuario } from '@/shared/hooks/useUsuario';
import { useProgreso } from '@/shared/hooks/useProgreso';
import { callar } from '@/shared/voz';
import Onboarding from '@/modules/inicio/Onboarding';
import MenuPrincipal from '@/modules/inicio/MenuPrincipal';
import Comunicador from '@/modules/comunicacion/Comunicador';
import Juegos from '@/modules/juegos/Juegos';
import Educacion from '@/modules/educacion/Educacion';

const MODULOS = { comunicacion: Comunicador, juegos: Juegos, educacion: Educacion };

function App() {
  const [usuario, setUsuario] = useUsuario();
  const [moduloActivo, setModuloActivo] = useState('menu');
  const progreso = useProgreso(usuario);

  const registrar = (nombre, avatar) => { setUsuario({ nombre, avatar }); setModuloActivo('menu'); };
  const cerrarSesion = () => { callar(); setUsuario(null); setModuloActivo('menu'); };
  const volverAlMenu = () => { callar(); setModuloActivo('menu'); };

  const Modulo = MODULOS[moduloActivo];

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <AnimatePresence mode="wait">
        {!usuario && (
          <motion.div key="onboarding" exit={{ opacity: 0 }}>
            <Onboarding onComplete={registrar} />
          </motion.div>
        )}

        {usuario && moduloActivo === 'menu' && (
          <MenuPrincipal key="menu" usuario={usuario} estrellas={progreso.totalEstrellas} onElegir={setModuloActivo} onSalir={cerrarSesion} />
        )}

        {usuario && Modulo && (
          <motion.div key={moduloActivo} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
            <Modulo usuario={usuario} onVolver={volverAlMenu} progreso={progreso} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
