import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar wishlist cuando el usuario esté logueado
  useEffect(() => {
    if (user && token) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user, token]);

  // Cargar wishlist desde el servidor
  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/wishlist');
      setWishlist(response.data.data.wishlist || []);
    } catch (error) {
      console.error('Error al cargar wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto a wishlist
  const addToWishlist = async (productId) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos a tu lista de deseos');
      return { success: false };
    }

    try {
      const response = await axios.post('http://localhost:3000/api/wishlist', {
        product_id: productId
      });

      // Actualizar estado local
      await loadWishlist();

      return { success: true, message: 'Producto agregado a tu lista de deseos' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al agregar a wishlist'
      };
    }
  };

  // Eliminar producto de wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/wishlist/${productId}`);

      // Actualizar estado local
      setWishlist(prevWishlist =>
        prevWishlist.filter(item => item.product_id !== productId)
      );

      return { success: true, message: 'Producto eliminado de tu lista de deseos' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar de wishlist'
      };
    }
  };

  // Verificar si un producto está en la wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  // Toggle wishlist (agregar o quitar)
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    loadWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};