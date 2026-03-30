import { createContext, useState, useCallback } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (product.product_type === "sealed_box") {
        if (existing) {
          // Increment quantity, capped at stock
          const newQty = Math.min(existing.quantity + qty, product.stock);
          return prev.map((i) => i.id === product.id ? { ...i, quantity: newQty } : i);
        }
        return [...prev, { ...product, quantity: Math.min(qty, product.stock) }];
      } else {
        // Singles: one per card, no duplicates
        if (existing) return prev;
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const updateQuantity = useCallback((id, newQty) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (newQty <= 0) return prev.filter((i) => i.id !== id);
      const capped = Math.min(newQty, item.stock);
      return prev.map((i) => i.id === id ? { ...i, quantity: capped } : i);
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}
