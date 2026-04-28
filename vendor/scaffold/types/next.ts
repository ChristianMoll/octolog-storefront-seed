export interface Params {
  locale: string;
  slug: string | string[];
  [key: string]: string | string[];
}

export type SearchParams = Record<string, string>;
