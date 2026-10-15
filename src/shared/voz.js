// Voz compartida (Text-to-Speech). Reemplaza todas las copias de hablar().
let vozCache = null;

const elegirVoz = () => {
  const voces = window.speechSynthesis.getVoices();
  if (!voces.length) return null; // Chrome puede devolver [] la primera vez
  vozCache = voces.find((v) => v.lang === 'es-AR') || voces.find((v) => v.lang.startsWith('es')) || null;
  return vozCache;
};

export const hablar = (texto, { velocidad = 0.9, tono = 1.1, interrumpir = true } = {}) => {
  if (!('speechSynthesis' in window)) return;
  if (interrumpir) window.speechSynthesis.cancel();
  // Normalizar texto: quitar signos de apertura, colapsar espacios
  const limpio = ('' + texto).replace(/[¡¿]/g, '').replace(/\s+/g, ' ').trim();
  const locucion = new SpeechSynthesisUtterance(limpio);
  locucion.lang = 'es-AR';
  locucion.rate = velocidad;
  locucion.pitch = tono;
  const voz = vozCache || elegirVoz();
  if (voz) locucion.voice = voz;
  window.speechSynthesis.speak(locucion);
};

export const callar = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};
