import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart on mount
  useEffect(() => {
    const stored = localStorage.getItem('aroma_cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart items:', e);
      }
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('aroma_cart', JSON.stringify(items));
  };

  const addToCart = (item) => {
    if (item.isBooking) {
      // Remove any existing table booking to avoid duplicates, and add the new one
      const filtered = cartItems.filter(i => !i.isBooking);
      saveCart([...filtered, item]);
      return;
    }

    // For dishes, check if they exist with same ID and same size
    const existingIndex = cartItems.findIndex(
      i => i.id === item.id && i.selectedSize === item.selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += item.quantity || 1;
      saveCart(updated);
    } else {
      saveCart([...cartItems, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  const removeFromCart = (id, selectedSize) => {
    const filtered = cartItems.filter(
      item => !(item.id === id && item.selectedSize === selectedSize)
    );
    saveCart(filtered);
  };

  const updateQuantity = (id, selectedSize, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    const updated = cartItems.map(item => {
      if (item.id === id && item.selectedSize === selectedSize) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((total, item) => {
    if (item.isBooking) return total + 1;
    return total + item.quantity;
  }, 0);

  const cartTotal = cartItems.reduce((total, item) => {
    if (item.isBooking) return total;
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
