import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (products.length > 0) {
      const newProducts = products.map(
        product => product.price * product.quantity,
      );
      const sumProductsPrice = newProducts.reduce((acu, cur) => acu + cur);

      return formatValue(sumProductsPrice);
    }

    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (products.length > 0) {
      const newProduct = products.map(product => product.quantity);
      return newProduct.reduce((acc, cur) => acc + cur);
    }
    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
