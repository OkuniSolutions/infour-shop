import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configurar axios para incluir el token en todas las peticiones
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Cargar datos del usuario
  const loadUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/me');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);

      const { token: newToken, user: newUser } = response.data.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrarse'
      };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Verificar si el usuario es admin o creador
  const isAdminOrCreator = () => {
    return user?.role === 'admin' || user?.role === 'content_creator';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAdminOrCreator
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};