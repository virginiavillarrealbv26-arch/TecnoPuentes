// Fuente única de vocabulario para juegos. genero: 'm' | 'f'
export const elementos = [
  { id: 'perro', icono: '🐶', texto: 'perro', genero: 'm' },
  { id: 'gato', icono: '🐱', texto: 'gato', genero: 'm' },
  { id: 'auto', icono: '🚗', texto: 'auto', genero: 'm' },
  { id: 'manzana', icono: '🍎', texto: 'manzana', genero: 'f' },
  { id: 'flor', icono: '🌻', texto: 'flor', genero: 'f' },
  { id: 'pelota', icono: '⚽', texto: 'pelota', genero: 'f' },
];

export const conArticulo = (e) => `${e.genero === 'f' ? 'la' : 'el'} ${e.texto}`;
export const conArticuloDe = (e) => `${e.genero === 'f' ? 'de la' : 'del'} ${e.texto}`;
