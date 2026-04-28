// @ts-nocheck
import { ShippingMethod } from '@shared/types/cart';
import { ShippingMethod as EntityShippingMethod } from '@/types/entity/shipping-method';
import { Currency } from '@/types/currency';

export const mapShippingMethod = (shippingMethod: ShippingMethod): EntityShippingMethod => {
  const defaultRate = shippingMethod.rates?.[0];

  return {
    id: shippingMethod.shippingMethodId,
    label: shippingMethod.name ?? '',
    description: shippingMethod.description ?? '',
    price: (defaultRate?.price?.centAmount ?? 0) / Math.pow(10, defaultRate?.price?.fractionDigits ?? 2),
    currency: (defaultRate?.price?.currencyCode ?? 'USD') as Currency,
    estimatedDeliveryDays: 7,
  };
};
