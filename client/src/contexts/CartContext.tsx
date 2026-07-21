import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  // Subscription fields
  isSubscription?: boolean;
  subscriptionFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  replaceItem: (oldId: string, newItem: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isLoading: boolean;
  showCartSidebar: boolean;
  setShowCartSidebar: (show: boolean) => void;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "herbsom-cart";

/**
 * Validates that the parsed data is a valid CartItem array
 */
function isValidCartItems(data: unknown): data is CartItem[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.price === "number" &&
      typeof item.quantity === "number" &&
      item.quantity > 0 &&
      item.price >= 0 &&
      (item.description === undefined || typeof item.description === "string") &&
      (item.isSubscription === undefined || typeof item.isSubscription === "boolean") &&
      (item.subscriptionFrequency === undefined || ['weekly', 'biweekly', 'monthly', 'quarterly'].includes(item.subscriptionFrequency))
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (isValidCartItems(parsedCart)) {
          setItems(parsedCart);
        } else {
          console.warn("Invalid cart data in localStorage, clearing cart");
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Clear corrupted localStorage data
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (e) {
        console.error("Failed to clear corrupted cart data:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isLoading]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevItems, newItem];
    });
    setLastAddedItem(newItem);
    setShowCartSidebar(true);
  };

  const replaceItem = (oldId: string, newItem: CartItem) => {
    setItems((prevItems) => {
      const oldItem = prevItems.find((item) => item.id === oldId);
      // Preserve the quantity from the old item
      const preservedQuantity = oldItem ? oldItem.quantity : newItem.quantity;
      const replacementItem = { ...newItem, quantity: preservedQuantity };

      // If the new config already exists as a separate item in the cart, merge them
      const existingTarget = prevItems.find((item) => item.id === newItem.id && item.id !== oldId);
      if (existingTarget) {
        // Remove the old item and add its quantity to the existing target
        return prevItems
          .filter((item) => item.id !== oldId)
          .map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + preservedQuantity }
              : item
          );
      }

      // Replace the old item with the new one at the same position
      return prevItems.map((item) =>
        item.id === oldId ? replacementItem : item
      );
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, replaceItem, removeItem, updateQuantity, clearCart, total, isLoading, showCartSidebar, setShowCartSidebar, lastAddedItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useCartSidebar() {
  const { showCartSidebar, setShowCartSidebar, lastAddedItem } = useCart();
  return { showCartSidebar, setShowCartSidebar, lastAddedItem };
}
