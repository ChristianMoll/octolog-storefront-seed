import type { Currency } from "./currency";
import type { Product } from "./product";

export interface Quote {
  id: string;
  author: string;
  status: string;
  creationDate: string;
  lastModifiedDate: string;
  businessUnit: string;
  activity: Array<{
    title: string;
    comment?: string;
    commentBy?: "seller" | "author";
    titleValues?: Record<string, string>;
    revoke?: boolean;
    renegotiate?: boolean;
    reply?: boolean;
  }>;
  total: number;
  subtotal: number;
  currency: Currency;
  taxCosts?: number;
  shippingCosts?: number;
  discount?: number;
  items: Product[];
  ownedByOtherUser?: boolean;
  purchaseOrderNumber?: string;
}
