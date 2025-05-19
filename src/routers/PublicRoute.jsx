import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PublicRoute;