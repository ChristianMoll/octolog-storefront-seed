export interface Country {
  name: string;
  code: string;
  states: Array<{ label: string; value: string }>;
  locales: Array<{ name: string; locale: string }>;
  currencies: string[];
}
