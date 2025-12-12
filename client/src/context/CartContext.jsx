import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Cargar carrito del localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Si ya existe, aumentar cantidad
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregarlo
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Obtener cantidad total de productos
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener precio total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Obtener cantidad de un producto específico
  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};