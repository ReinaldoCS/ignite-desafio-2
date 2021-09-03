import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO

      const getProduct: Product = (await (api.get(`/products/${productId}`))).data;
      const getProductAmount: Stock = (await (api.get(`/stock/${productId}`))).data;

      const indexCard = cart.findIndex(x => x.id === productId);

      let newCart = cart;

      if(getProductAmount.amount <= 0) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if (indexCard >= 0) {
        newCart[indexCard].amount += 1;

        setCart(newCart);

        // await api.put(`/stock/${productId}`, {amount: getProductAmount.amount - 1});

        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));

        toast.success('Quantidade ja adicionada');

        return;
      }

      setCart([...newCart, {...getProduct, amount: 1}]);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(
        [...newCart, {...getProduct, amount: 1}],
      ));

      // await api.put(`/stock/${productId}`, {amount: getProductAmount.amount - 1});

      toast.success('Produto adicionado');

      return;

    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
