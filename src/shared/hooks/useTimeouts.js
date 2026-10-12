import { useEffect, useRef, useCallback } from 'react';
import { callar } from '../voz';

// Timeouts que se cancelan solos al desmontar, y silencian la voz.
export const useTimeouts = () => {
  const ids = useRef([]);

  const programar = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    ids.current.push(id);
    return id;
  }, []);

  const limpiar = useCallback(() => {
    ids.current.forEach(clearTimeout);
    ids.current = [];
  }, []);

  useEffect(() => () => { limpiar(); callar(); }, [limpiar]);

  return { programar, limpiar };
};
