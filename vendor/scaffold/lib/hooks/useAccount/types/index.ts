export interface UseAccountReturn {
  account?: unknown;
  login: (...args: unknown[]) => Promise<unknown>;
  logout: () => Promise<void>;
  register: (...args: unknown[]) => Promise<unknown>;
  confirm: (...args: unknown[]) => Promise<unknown>;
  requestPasswordReset: (...args: unknown[]) => Promise<unknown>;
  resetPassword: (...args: unknown[]) => Promise<unknown>;
  update: (...args: unknown[]) => Promise<unknown>;
  addAddress: (...args: unknown[]) => Promise<unknown>;
  updateAddress: (...args: unknown[]) => Promise<unknown>;
  removeAddress: (...args: unknown[]) => Promise<unknown>;
  setDefaultBillingAddress: (...args: unknown[]) => Promise<unknown>;
  setDefaultShippingAddress: (...args: unknown[]) => Promise<unknown>;
}
