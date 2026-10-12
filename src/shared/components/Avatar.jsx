import { iconoAvatar } from '../data/avatares';

// Muestra el emoji a partir del id guardado ('niño', 'robot', ...)
const Avatar = ({ id, className = 'text-2xl' }) => (
  <span className={className} role="img" aria-label="Avatar">{iconoAvatar(id)}</span>
);

export default Avatar;
