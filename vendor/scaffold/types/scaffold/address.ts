export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country: string;
  isDefaultBilling?: boolean;
  isDefaultShipping?: boolean;
  careOf?: string;
}
