// Cada dibujo es una lista de zonas pintables, en orden de capas (la primera queda al fondo).
// `nombre` incluye el artículo para la voz ("Pintaste el techo...").
const T = '#374151'; // color de contorno
const borde = { stroke: T, strokeWidth: 4, strokeLinejoin: 'round' };

export const dibujos = [
  {
    id: 'casa', icono: '🏠', titulo: 'Casa',
    zonas: [
      { id: 'cielo', nombre: 'el cielo', tag: 'rect', fondo: '#F9FAFB', props: { x: 0, y: 0, width: 200, height: 200 } },
      { id: 'pasto', nombre: 'el pasto', tag: 'rect', props: { x: 0, y: 160, width: 200, height: 40, ...borde } },
      { id: 'sol', nombre: 'el sol', tag: 'circle', props: { cx: 160, cy: 40, r: 20, ...borde } },
      { id: 'pared', nombre: 'la pared', tag: 'rect', props: { x: 40, y: 90, width: 120, height: 70, ...borde } },
      { id: 'techo', nombre: 'el techo', tag: 'polygon', props: { points: '100,30 20,90 180,90', ...borde } },
      { id: 'puerta', nombre: 'la puerta', tag: 'rect', props: { x: 80, y: 120, width: 40, height: 40, ...borde } },
      { id: 'ventana1', nombre: 'la ventana izquierda', tag: 'rect', props: { x: 50, y: 110, width: 20, height: 20, ...borde } },
      { id: 'ventana2', nombre: 'la ventana derecha', tag: 'rect', props: { x: 130, y: 110, width: 20, height: 20, ...borde } },
    ],
  },
  {
    id: 'flor', icono: '🌻', titulo: 'Flor',
    zonas: [
      { id: 'cielo', nombre: 'el cielo', tag: 'rect', fondo: '#F9FAFB', props: { x: 0, y: 0, width: 200, height: 200 } },
      { id: 'pasto', nombre: 'el pasto', tag: 'rect', props: { x: 0, y: 160, width: 200, height: 40, ...borde } },
      { id: 'tallo', nombre: 'el tallo', tag: 'rect', props: { x: 96, y: 105, width: 8, height: 55, ...borde } },
      { id: 'hoja', nombre: 'la hoja', tag: 'ellipse', props: { cx: 128, cy: 135, rx: 20, ry: 9, ...borde } },
      { id: 'petalo1', nombre: 'el pétalo de arriba', tag: 'circle', props: { cx: 100, cy: 52, r: 20, ...borde } },
      { id: 'petalo2', nombre: 'el pétalo de abajo', tag: 'circle', props: { cx: 100, cy: 108, r: 20, ...borde } },
      { id: 'petalo3', nombre: 'el pétalo izquierdo', tag: 'circle', props: { cx: 72, cy: 80, r: 20, ...borde } },
      { id: 'petalo4', nombre: 'el pétalo derecho', tag: 'circle', props: { cx: 128, cy: 80, r: 20, ...borde } },
      { id: 'centro', nombre: 'el centro', tag: 'circle', props: { cx: 100, cy: 80, r: 14, ...borde } },
    ],
  },
  {
    id: 'arbol', icono: '🌳', titulo: 'Árbol',
    zonas: [
      { id: 'cielo', nombre: 'el cielo', tag: 'rect', fondo: '#F9FAFB', props: { x: 0, y: 0, width: 200, height: 200 } },
      { id: 'suelo', nombre: 'el suelo', tag: 'rect', props: { x: 0, y: 165, width: 200, height: 35, ...borde } },
      { id: 'tronco', nombre: 'el tronco', tag: 'rect', props: { x: 90, y: 92, width: 20, height: 60, ...borde } },
      { id: 'hoja1', nombre: 'la hoja izquierda', tag: 'ellipse', props: { cx: 78, cy: 75, rx: 32, ry: 25, ...borde } },
      { id: 'hoja2', nombre: 'la hoja central', tag: 'ellipse', props: { cx: 100, cy: 55, rx: 35, ry: 28, ...borde } },
      { id: 'hoja3', nombre: 'la hoja derecha', tag: 'ellipse', props: { cx: 122, cy: 78, rx: 32, ry: 25, ...borde } },
      { id: 'fruta1', nombre: 'la fruta', tag: 'circle', props: { cx: 110, cy: 92, r: 8, ...borde } },
      { id: 'fruta2', nombre: 'la fruta de abajo', tag: 'circle', props: { cx: 92, cy: 95, r: 8, ...borde } },
    ],
  },
  {
    id: 'estrella', icono: '⭐', titulo: 'Estrella',
    zonas: [
      { id: 'fondo', nombre: 'el fondo', tag: 'rect', fondo: '#FFF7ED', props: { x: 0, y: 0, width: 200, height: 200 } },
      { id: 'estrella', nombre: 'la estrella', tag: 'polygon', props: { points: '100,20 110,50 140,50 115,70 125,100 100,80 75,100 85,70 60,50 90,50', ...borde } },
    ],
  },
  {
    id: 'helado', icono: '🍦', titulo: 'Helado',
    zonas: [
      { id: 'cielo', nombre: 'el cielo', tag: 'rect', fondo: '#EFF6FF', props: { x: 0, y: 0, width: 200, height: 200 } },
      { id: 'cono', nombre: 'el cono', tag: 'polygon', props: { points: '70,70 130,70 100,160', ...borde } },
      { id: 'bola1', nombre: 'la primera bola', tag: 'circle', props: { cx: 100, cy: 65, r: 28, ...borde } },
      { id: 'bola2', nombre: 'la segunda bola', tag: 'circle', props: { cx: 100, cy: 38, r: 25, ...borde } },
      { id: 'cereza', nombre: 'la cereza', tag: 'circle', props: { cx: 100, cy: 15, r: 12, ...borde } },
    ],
  },
  {
    id: 'robot', icono: '🤖', titulo: 'Robot',
    zonas: [
      { id: 'fondo', nombre: 'el fondo', tag: 'rect', fondo: '#F3F4F6', props: { x: 0, y: 0, width: 200, height: 200 } },
      { id: 'cabeza', nombre: 'la cabeza', tag: 'rect', props: { x: 55, y: 35, width: 90, height: 60, rx: 12, ...borde } },
      { id: 'ojo1', nombre: 'el ojo izquierdo', tag: 'circle', props: { cx: 78, cy: 60, r: 10, ...borde } },
      { id: 'ojo2', nombre: 'el ojo derecho', tag: 'circle', props: { cx: 122, cy: 60, r: 10, ...borde } },
      { id: 'cuerpo', nombre: 'el cuerpo', tag: 'rect', props: { x: 48, y: 95, width: 104, height: 62, rx: 14, ...borde } },
      { id: 'brazo1', nombre: 'el brazo izquierdo', tag: 'rect', props: { x: 28, y: 105, width: 20, height: 10, rx: 5, ...borde } },
      { id: 'brazo2', nombre: 'el brazo derecho', tag: 'rect', props: { x: 152, y: 105, width: 20, height: 10, rx: 5, ...borde } },
      { id: 'boton1', nombre: 'el botón central', tag: 'circle', props: { cx: 100, cy: 120, r: 8, ...borde } },
      { id: 'boton2', nombre: 'el botón inferior', tag: 'circle', props: { cx: 100, cy: 142, r: 8, ...borde } },
      { id: 'pierna1', nombre: 'la pierna izquierda', tag: 'rect', props: { x: 68, y: 157, width: 16, height: 25, rx: 5, ...borde } },
      { id: 'pierna2', nombre: 'la pierna derecha', tag: 'rect', props: { x: 116, y: 157, width: 16, height: 25, rx: 5, ...borde } },
    ],
  },
];

export const colores = [
  { id: 'rojo', hex: '#FF5454', nombre: 'Rojo' },
  { id: 'azul', hex: '#3B82F6', nombre: 'Azul' },
  { id: 'amarillo', hex: '#FFD93D', nombre: 'Amarillo' },
  { id: 'verde', hex: '#10B981', nombre: 'Verde' },
  { id: 'naranja', hex: '#FF9500', nombre: 'Naranja' },
  { id: 'morado', hex: '#8B5CF6', nombre: 'Morado' },
  { id: 'rosa', hex: '#EC4899', nombre: 'Rosa' },
  { id: 'turquesa', hex: '#06B6D4', nombre: 'Turquesa' },
  { id: 'lima', hex: '#84CC16', nombre: 'Lima' },
  { id: 'indigo', hex: '#6366F1', nombre: 'Índigo' },
  { id: 'marron', hex: '#B45309', nombre: 'Marrón' },
  { id: 'negro', hex: '#1F2937', nombre: 'Negro' },
];
