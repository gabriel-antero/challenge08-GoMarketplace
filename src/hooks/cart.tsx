import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const getProducts = (await AsyncStorage.getItem(
        '@GoMarketPlace:item',
      )) as string;

      setProducts(JSON.parse(getProducts));
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function updateProducts(): Promise<void> {
      await AsyncStorage.setItem(
        '@GoMarketPlace:item',
        JSON.stringify(products),
      );
    }

    updateProducts();
  }, [products]);

  const addToCart = useCallback(
    async product => {
      const searchProductRepeated = products.filter(
        value => value.id === product.id,
      );

      if (searchProductRepeated[0]) {
        return;
      }

      const newProduct = {
        ...product,
        quantity: 1,
      };

      setProducts([...products, newProduct]);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const indexProduct = products.findIndex(product => id === product.id);

      const Products = [...products];

      Products[indexProduct].quantity += 1;

      setProducts(Products);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const indexProduct = products.findIndex(product => product.id === id);

      const Products = [...products];

      if (Products[indexProduct].quantity === 1) {
        const productRemoved = Products.filter(product => product.id !== id);

        setProducts(productRemoved);

        return;
      }

      Products[indexProduct].quantity -= 1;

      setProducts(Products);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
