import { useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';

export type ShippingMethod = 'standard' | 'express' | 'overnight';

export const useCartSummary = () => {
  const { items, totalItems } = useCartStore();

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getShippingCost = (method: ShippingMethod) => {
    const baseShipping = 5.99;
    switch (method) {
      case 'standard':
        return baseShipping;
      case 'express':
        return baseShipping * 2;
      case 'overnight':
        return baseShipping * 3;
      default:
        return baseShipping;
    }
  };

  const calculateTotal = (shippingMethod: ShippingMethod = 'standard') => {
    const shipping = getShippingCost(shippingMethod);
    return subtotal + shipping;
  };

  return {
    subtotal,
    totalItems,
    getShippingCost,
    calculateTotal,
  };
}; 