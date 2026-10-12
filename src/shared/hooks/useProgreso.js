import { useState, useEffect, useRef, useCallback } from 'react';

const prefijo = 'tecnopuentes_progreso_';
const UMBRALES = [5, 15, 30]; // aciertos para ganar 1, 2 y 3 estrellas por juego

export const estrellasDe = (aciertos = 0) => UMBRALES.filter((u) => aciertos >= u).length;
export const MAX_ESTRELLAS = UMBRALES.length;

const leer = (clave) => {
  try { return JSON.parse(localStorage.getItem(clave)) ?? {}; } catch { return {}; }
};

// Progreso por niño (se guarda según su nombre). { [juegoId]: { aciertos } }
export const useProgreso = (usuario) => {
  const clave = usuario ? prefijo + usuario.nombre.toLowerCase() : null;
  const [progreso, setProgreso] = useState({});
  const ref = useRef({}); // valor más reciente, para decidir si ganó una estrella nueva

  useEffect(() => {
    const p = clave ? leer(clave) : {};
    ref.current = p;
    setProgreso(p);
  }, [clave]);

  // Devuelve true si este acierto desbloqueó una estrella nueva
  const registrarAcierto = useCallback((juegoId) => {
    if (!clave) return false;
    const antes = ref.current[juegoId]?.aciertos ?? 0;
    const nuevo = { ...ref.current, [juegoId]: { aciertos: antes + 1 } };
    ref.current = nuevo;
    setProgreso(nuevo);
    try { localStorage.setItem(clave, JSON.stringify(nuevo)); } catch { /* sin persistencia */ }
    return estrellasDe(antes + 1) > estrellasDe(antes);
  }, [clave]);

  const estrellasJuego = (juegoId) => estrellasDe(progreso[juegoId]?.aciertos);
  const totalEstrellas = Object.values(progreso).reduce((s, j) => s + estrellasDe(j.aciertos), 0);

  return { progreso, registrarAcierto, estrellasJuego, totalEstrellas };
};
