import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = 'bi-inbox', 
  title = 'No hay elementos', 
  message = 'No se encontraron elementos para mostrar',
  actionText,
  actionLink
}) => {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`}></i>
      <h3>{title}</h3>
      <p className="text-muted">{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary mt-3">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;