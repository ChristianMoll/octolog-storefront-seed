export interface Category {
  categoryId: string;
  categoryKey?: string;
  categoryRef?: string;
  name: string;
  link: string;
  paths: Partial<Record<string, string>>;
  descendants: Category[];
}
