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
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.14),_transparent_38%),linear-gradient(180deg,#f8fafc_0%,#f3f6fb_100%)] px-2 py-3 font-sans text-slate-800 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-[420px] sm:max-w-[980px] lg:max-w-[1100px]">
        <AnimatePresence mode="wait">
        {!usuario && (
          <motion.div key="onboarding" exit={{ opacity: 0 }} className="w-full">
            <Onboarding onComplete={registrar} />
          </motion.div>
        )}

        {usuario && moduloActivo === 'menu' && (
          <MenuPrincipal key="menu" usuario={usuario} estrellas={progreso.totalEstrellas} onElegir={setModuloActivo} onSalir={cerrarSesion} />
        )}

        {usuario && Modulo && (
          <motion.div key={moduloActivo} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="w-full">
            <Modulo usuario={usuario} onVolver={volverAlMenu} progreso={progreso} />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
