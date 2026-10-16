"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { saveCart } from "../_actions/products";
import type { Cart } from "./cart";

interface CartContextValue {
  cart: Cart;
  addProduct: (productId: number) => void;
  decrementProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: Cart;
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState(initialCart);
  const hasMounted = useRef(false);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    pendingSave.current = pendingSave.current
      .then(() => saveCart(cart))
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to save cart.",
        );
      });
  }, [cart]);

  const addProduct = useCallback((productId: number) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.products.find(
        (product) => product.id === productId,
      );

      return {
        products: existingProduct
          ? currentCart.products.map((product) =>
              product.id === productId
                ? { ...product, quantity: product.quantity + 1 }
                : product,
            )
          : [...currentCart.products, { id: productId, quantity: 1 }],
      };
    });
  }, []);

  const decrementProduct = useCallback((productId: number) => {
    setCart((currentCart) => ({
      products: currentCart.products.flatMap((product) =>
        product.id !== productId
          ? [product]
          : product.quantity > 1
            ? [{ ...product, quantity: product.quantity - 1 }]
            : [],
      ),
    }));
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setCart((currentCart) => ({
      products: currentCart.products.filter(
        (product) => product.id !== productId,
      ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({ products: [] });
  }, []);

  const value = useMemo(
    () => ({ cart, addProduct, decrementProduct, removeProduct, clearCart }),
    [cart, addProduct, decrementProduct, removeProduct, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
