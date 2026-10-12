import { MAX_ESTRELLAS } from '../hooks/useProgreso';

const Estrellas = ({ cantidad, className = 'text-xl' }) => (
  <span className={className} role="img" aria-label={`${cantidad} de ${MAX_ESTRELLAS} estrellas`}>
    {Array.from({ length: MAX_ESTRELLAS }, (_, i) => (i < cantidad ? '⭐' : '☆')).join('')}
  </span>
);

export default Estrellas;
