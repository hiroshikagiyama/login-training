import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      const response = await axios.get('/api/auth_check', {
        withCredentials: true, // セッション情報を送信
      });
      setIsAuthenticated(response.data.authenticated);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // 認証状態が判明するまでローディング表示
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
