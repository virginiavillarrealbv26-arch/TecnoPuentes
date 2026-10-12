export const avatares = [
  { id: 'niño', icono: '👦', texto: 'Niño' },
  { id: 'niña', icono: '👧', texto: 'Niña' },
  { id: 'robot', icono: '🤖', texto: 'Robot' },
];

export const iconoAvatar = (id) => avatares.find((a) => a.id === id)?.icono ?? '🙂';
