export interface AccountResult {
  accountId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  confirmed?: boolean;
  [key: string]: unknown;
}
