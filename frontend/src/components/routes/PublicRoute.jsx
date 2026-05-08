import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../common/Loader';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader className="min-h-screen" />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
