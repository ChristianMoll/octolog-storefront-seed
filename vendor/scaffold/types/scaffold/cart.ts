export interface Money {
  fractionDigits?: number;
  centAmount?: number;
  currencyCode?: string;
}

export interface Tax {
  netAmount?: Money;
  grossAmount?: Money;
  taxAmount?: Money;
  name?: string;
}

export interface TaxRate {
  taxRateId?: string;
  taxRateKey?: string;
  name?: string;
  amount?: number;
  includedInPrice?: boolean;
  country?: string;
  state?: string;
}

export interface Variant {
  id?: string;
  sku: string;
  groupId?: string;
  price?: Money;
  images?: string[];
  isOnStock?: boolean;
  availableQuantity?: number;
  restockableInDays?: number;
  isMatchingVariant?: boolean;
  // reason: scaffold-b2b Variant.attributes is Record<string, any>
  attributes?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface ProductDiscountedPrice {
  value?: Money;
  discount?: {
    description?: string;
    name?: string;
  };
}

export interface DiscountedPricePerCount {
  count?: number;
  discountedPrice?: ProductDiscountedPrice;
}

export interface LineItemShippingAddress {
  addressKey: string;
  count: number;
}

export interface LineItem {
  lineItemId?: string;
  productId?: string;
  productSlug?: string;
  name?: string;
  type?: string;
  count?: number;
  price?: Money;
  discountedPrice?: ProductDiscountedPrice;
  discountedPricePerCount?: DiscountedPricePerCount[];
  totalPrice?: Money;
  taxed?: Tax;
  taxRate?: TaxRate;
  variant?: Variant;
  isGift?: boolean;
  _url?: string;
  shippingDetails?: {
    shippingAddresses?: LineItemShippingAddress[];
    valid: boolean;
  };
}

export interface Address {
  addressId?: string;
  key?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  streetName?: string;
  streetNumber?: string;
  additionalStreetInfo?: string;
  additionalAddressInfo?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  state?: string;
  phone?: string;
  isDefaultBillingAddress?: boolean;
  isDefaultShippingAddress?: boolean;
  isShippingAddress?: boolean;
  isBillingAddress?: boolean;
}

export interface Payment {
  id: string;
  paymentProvider: string;
  paymentId: string;
  amountPlanned: Money;
  debug?: string;
  paymentStatus: string;
  version?: number;
  paymentMethod: string;
}

export interface DiscountCode {
  discountCodeId?: string;
  code?: string;
  name?: string;
  description?: string;
  discountedAmount?: Money;
}

export interface ShippingRate {
  shippingRateId?: string;
  name?: string;
  price?: Money;
  freeAbove?: Money;
}

export interface CartShippingMethod {
  shippingMethodId: string;
  name?: string;
  description?: string;
  rates?: ShippingRate[];
}

export interface ShippingInfo {
  shippingMethodId?: string;
  name?: string;
  price?: Money;
  rate?: ShippingRate;
  taxRate?: TaxRate;
  taxed?: Tax;
}

export enum CartOrigin {
  Customer = 'Customer',
  Merchant = 'Merchant',
  Quote = 'Quote',
}

export enum CartState {
  Active = 'Active',
  Frozen = 'Frozen',
  Merged = 'Merged',
  Ordered = 'Ordered',
}

export interface Cart {
  cartId: string;
  cartVersion?: string;
  lineItems?: LineItem[];
  email?: string;
  shippingInfo?: ShippingInfo;
  availableShippingMethods?: CartShippingMethod[];
  shippingAddress?: Address;
  billingAddress?: Address;
  itemShippingAddresses?: Address[];
  sum?: Money;
  payments?: Payment[];
  discountCodes?: DiscountCode[];
  taxed?: Tax;
  origin?: CartOrigin;
  cartState?: CartState;
  accountId?: string;
  businessUnitKey?: string;
  storeKey?: string;
}

export interface ReturnLineItem {
  returnLineItemId?: string;
  lineItemId: string;
  count: number;
  comment?: string;
  createdAt?: Date;
}

export interface ReturnInfo {
  lineItems: ReturnLineItem[];
  returnDate?: Date;
  returnTrackingId?: string;
}

export enum OrderState {
  Cancelled = 'Cancelled',
  Complete = 'Complete',
  Confirmed = 'Confirmed',
  Open = 'Open',
}

export enum ShipmentState {
  Backorder = 'Backorder',
  Delayed = 'Delayed',
  Delivered = 'Delivered',
  Partial = 'Partial',
  Pending = 'Pending',
  Ready = 'Ready',
  Shipped = 'Shipped',
}

export interface Order extends Cart {
  orderId?: string;
  orderVersion?: string;
  orderNumber?: string;
  orderState?: OrderState;
  createdAt?: Date;
  businessUnitKey?: string;
  returnInfo?: ReturnInfo[];
  purchaseOrderNumber?: string;
  quoteId?: string;
  shipmentState?: ShipmentState;
}
