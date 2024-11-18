// src/components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('bearerToken');
  const location = useLocation();
  const baseUrl = process.env.REACT_APP_BASE_URL || "";

  if (!user) {
    return <Navigate to={`${baseUrl}/auth/signin`} state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;