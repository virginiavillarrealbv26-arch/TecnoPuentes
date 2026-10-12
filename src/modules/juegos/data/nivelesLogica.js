// Tablero 4x4. x = columna (0 izquierda), y = fila (0 arriba).
export const nivelesLogica = [
  { id: 1, cols: 4, filas: 4, inicio: { x: 0, y: 3 }, meta: { x: 3, y: 0 }, obstaculos: [] },
  { id: 2, cols: 4, filas: 4, inicio: { x: 0, y: 3 }, meta: { x: 3, y: 0 }, obstaculos: [{ x: 1, y: 2 }, { x: 2, y: 1 }] },
  { id: 3, cols: 4, filas: 4, inicio: { x: 0, y: 0 }, meta: { x: 3, y: 3 }, obstaculos: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }] },
];
