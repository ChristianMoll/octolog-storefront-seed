import type { Currency } from "./currency";
import type { Product } from "./product";

export type OrderStatus =
  | "Delivered"
  | "Pending"
  | "Shipped"
  | "Confirmed"
  | "Returned";

export interface Order {
  id: string;
  number: string;
  businessUnit: string;
  creationDate: string;
  status: OrderStatus;
  items: Product[];
  currency: Currency;
  taxCosts: number;
  subtotal: number;
  discount: number;
  shippingCosts: number;
  total: number;
  isFromAQuote: boolean;
  purchaseOrderNumber?: string;
}
