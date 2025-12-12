import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false, requireAdminOrCreator = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Verificando autenticación..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requireAdminOrCreator && user.role !== 'admin' && user.role !== 'content_creator') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;