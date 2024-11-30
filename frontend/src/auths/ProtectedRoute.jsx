import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth_check', {
        credentials: 'include', // セッション情報を送信
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // 認証状態が判明するまでローディング表示
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
