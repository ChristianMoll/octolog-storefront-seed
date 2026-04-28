import type { Address } from "./address";
import type { Associate } from "./associate";

export interface Store {
  id: string;
  key?: string;
  name: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  key: string;
  email: string;
  addresses: Address[];
  stores: Store[];
  topLevelUnit?: BusinessUnit;
  parentUnit?: BusinessUnit;
  associates: Associate[];
}
