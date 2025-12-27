"use client";

import React, { createContext, useContext, useState } from "react";

type CartContextValue = {
  items: unknown[];
  addItem: (item: unknown) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<unknown[]>([]);

  function addItem(item: unknown) {
    setItems((prev) => [...prev, item]);
  }

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
