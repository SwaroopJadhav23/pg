import { Navigate } from 'react-router-dom';
import { ROLE_HOME } from '../config/constants';
import { useAuth } from './AuthContext';

export function RoleRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
}
