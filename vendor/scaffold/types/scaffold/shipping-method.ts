import type { Currency } from './currency';

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  estimatedDeliveryDays?: number;
  price: number;
  currency: Currency;
}
