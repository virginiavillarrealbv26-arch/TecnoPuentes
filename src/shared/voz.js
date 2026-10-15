// Voz compartida (Text-to-Speech). Reemplaza todas las copias de hablar().
let vozCache = null;
let vocesCargadas = false;

const elegirVoz = () => {
  if (!('speechSynthesis' in window)) return null;
  const voces = window.speechSynthesis.getVoices();
  if (!voces.length) return null; // puede no estar listo aún
  vocesCargadas = true;
  // Preferir es-AR, luego cualquier es-*, luego la primera disponible
  vozCache = voces.find((v) => v.lang === 'es-AR') || voces.find((v) => v.lang.startsWith('es')) || voces[0] || null;
  return vozCache;
};

// Intentar cargar voces cuando cambian (algunos navegadores las devuelven asincrónicamente)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { elegirVoz(); };
}

export const hablar = (texto, { velocidad = 0.9, tono = 1.1, interrumpir = true } = {}) => {
  if (!('speechSynthesis' in window)) return;
  if (interrumpir) window.speechSynthesis.cancel();
  // Normalizar texto: quitar signos de apertura, colapsar espacios
  const limpio = ('' + texto).replace(/[¡¿]/g, '').replace(/\s+/g, ' ').trim();

  // Asegurar que tenemos una voz seleccionada si es posible
  const voz = vozCache || elegirVoz();

  const locucion = new SpeechSynthesisUtterance(limpio);
  // Si la voz tiene lang, úsala; sino usar 'es-ES' como fallback
  locucion.lang = (voz && voz.lang) ? voz.lang : 'es-ES';
  locucion.rate = velocidad;
  locucion.pitch = tono;
  if (voz) locucion.voice = voz;

  try {
    window.speechSynthesis.speak(locucion);
  } catch (e) {
    // En algunos entornos móviles puede fallar si no hubo interacción de usuario
    // No hacemos nada extra aquí, el llamador debe asegurarse de interacción previa.
    console.warn('No se pudo reproducir TTS:', e);
  }
};

export const callar = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};
