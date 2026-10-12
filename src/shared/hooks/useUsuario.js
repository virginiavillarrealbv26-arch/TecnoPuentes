import { useState, useCallback } from 'react';

const CLAVE = 'tecnopuentes_usuario';

const leer = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE)); } catch { return null; }
};

// Usuario persistente: sobrevive a recargas de página.
export const useUsuario = () => {
  const [usuario, setUsuarioState] = useState(leer);

  const guardar = useCallback((nuevo) => {
    setUsuarioState(nuevo);
    try {
      if (nuevo) localStorage.setItem(CLAVE, JSON.stringify(nuevo));
      else localStorage.removeItem(CLAVE);
    } catch { /* modo privado: seguimos en memoria */ }
  }, []);

  return [usuario, guardar];
};
