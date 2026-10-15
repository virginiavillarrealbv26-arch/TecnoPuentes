import { useCallback, useState } from 'react';

const leer = (clave) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? {};
  } catch {
    return {};
  }
};

const generarId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `custom_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const useTarjetasPersonalizadas = (clave) => {
  const [tarjetas, setTarjetas] = useState(() => leer(clave));

  const guardar = useCallback((nuevo) => {
    setTarjetas(nuevo);
    try {
      localStorage.setItem(clave, JSON.stringify(nuevo));
    } catch {
      /* modo privado: seguimos en memoria */
    }
  }, [clave]);

  const agregarTarjeta = useCallback((categoria, tarjeta) => {
    const texto = tarjeta.texto.trim();
    const icono = tarjeta.icono.trim() || '⭐';

    if (!texto) return;

    guardar((prev) => ({
      ...prev,
      [categoria]: [
        ...(prev[categoria] ?? []),
        {
          id: generarId(),
          icono,
          texto,
          voz: texto,
          personalizada: true,
        },
      ],
    }));
  }, [guardar]);

  const eliminarTarjeta = useCallback((categoria, id) => {
    guardar((prev) => ({
      ...prev,
      [categoria]: (prev[categoria] ?? []).filter((tarjeta) => tarjeta.id !== id),
    }));
  }, [guardar]);

  return {
    tarjetasPersonalizadas: tarjetas,
    agregarTarjetaPersonalizada: agregarTarjeta,
    eliminarTarjetaPersonalizada: eliminarTarjeta,
  };
};
