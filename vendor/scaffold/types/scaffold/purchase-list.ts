import type { Currency } from "./currency";
import type { Store } from "./business-unit";

export interface PurchaseListItem {
  id?: string;
  sku: string;
  url: string;
  name: string;
  quantity: number;
  image?: string;
  price: number;
  currency: Currency;
  inStock: boolean;
  manufacturer?: string;
  pressure?: string;
  partNumber?: string;
  weight?: string;
  maxQuantity?: number;
}

export interface PurchaseList {
  id: string;
  name: string;
  description: string;
  store?: Store;
  items: PurchaseListItem[];
  businessUnitKey: string;
  account?: Record<string, unknown>;
  createdAt: string;
}
