import type { Product } from '@/types/entity/product';
import type { Category } from '@/types/entity/category';
import type { Currency } from '@/types/currency';
import { ctpFetch } from './client';

type LocalizedString = Record<string, string>;

interface CTPCategory {
  id: string;
  key?: string;
  slug: LocalizedString;
  name: LocalizedString;
  parent?: { id: string };
  ancestors?: { id: string }[];
  orderHint?: string;
}

interface CTPMoney {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
}

interface CTPPrice {
  value: CTPMoney;
  discounted?: { value: CTPMoney };
}

interface CTPImage {
  url: string;
  label?: string;
}

interface CTPAttribute {
  name: string;
  value: unknown;
}

interface CTPProductVariant {
  id: number;
  sku?: string;
  prices?: CTPPrice[];
  images?: CTPImage[];
  attributes?: CTPAttribute[];
}

interface CTPProductProjection {
  id: string;
  key?: string;
  name: LocalizedString;
  slug: LocalizedString;
  description?: LocalizedString;
  metaDescription?: LocalizedString;
  categories?: { id: string }[];
  masterVariant: CTPProductVariant;
  variants: CTPProductVariant[];
  hasStagedChanges?: boolean;
}

interface PagedQueryResult<T> {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: T[];
  facets?: Record<string, unknown>;
}

const LOCALE = 'en-US';
const FALLBACK_LOCALES = ['en-US', 'en', 'en-GB', 'de-DE'];

function pickLocalized(value?: LocalizedString, fallback = ''): string {
  if (!value) return fallback;
  for (const locale of FALLBACK_LOCALES) {
    if (value[locale]) return value[locale];
  }
  const first = Object.values(value)[0];
  return first ?? fallback;
}

function formatPrice(price?: CTPPrice): { price?: number; discountedPrice?: number; currency?: Currency } {
  if (!price) return {};
  const base = price.value.centAmount / Math.pow(10, price.value.fractionDigits);
  const out: { price?: number; discountedPrice?: number; currency?: Currency } = {
    price: base,
    currency: price.value.currencyCode as Currency,
  };
  if (price.discounted) {
    out.discountedPrice = price.discounted.value.centAmount / Math.pow(10, price.discounted.value.fractionDigits);
  }
  return out;
}

function variantImages(variant: CTPProductVariant): string[] {
  return (variant.images ?? []).map((i) => i.url);
}

function attrToString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.label === 'string') return obj.label;
    if (typeof obj.label === 'object') return pickLocalized(obj.label as LocalizedString);
    if (typeof obj.key === 'string') return obj.key;
    if (typeof obj.name === 'string') return obj.name;
  }
  return '';
}

function variantAttributes(variant: CTPProductVariant): { label: string; value: string }[] {
  return (variant.attributes ?? [])
    .map((a) => {
      const value = attrToString(a.value);
      if (!value) return null;
      const label = a.name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { label, value };
    })
    .filter((v): v is { label: string; value: string } => v !== null);
}

function projectionToProduct(p: CTPProductProjection): Product {
  const variant = p.masterVariant;
  const slug = pickLocalized(p.slug);
  const priceInfo = formatPrice(variant.prices?.[0]);
  const specs = variantAttributes(variant);

  return {
    id: p.id,
    key: p.key,
    sku: variant.sku,
    name: pickLocalized(p.name),
    description: pickLocalized(p.description),
    images: variantImages(variant),
    inStock: true,
    maxQuantity: 99,
    specifications: specs,
    specs,
    url: slug ? `/p/${slug}` : `/p/${p.id}`,
    ...priceInfo,
  };
}

function buildCategoryTree(raw: CTPCategory[]): Category[] {
  const byId = new Map<string, Category & { __parentId?: string }>();

  for (const c of raw) {
    const slug = pickLocalized(c.slug, c.id);
    byId.set(c.id, {
      categoryId: c.id,
      categoryKey: c.key,
      name: pickLocalized(c.name, c.id),
      link: `/c/${slug}`,
      paths: { [LOCALE]: `/c/${slug}` },
      descendants: [],
      __parentId: c.parent?.id,
    });
  }

  const roots: Category[] = [];
  for (const node of byId.values()) {
    if (node.__parentId && byId.has(node.__parentId)) {
      byId.get(node.__parentId)!.descendants.push(node);
    } else {
      roots.push(node);
    }
  }
  for (const node of byId.values()) {
    delete (node as { __parentId?: string }).__parentId;
  }
  return roots;
}

export async function listCategories(): Promise<Category[]> {
  const data = await ctpFetch<PagedQueryResult<CTPCategory>>('/categories', {
    query: { limit: 200, sort: 'orderHint asc' },
    revalidate: 300,
  });
  return buildCategoryTree(data.results);
}

export async function getCategoryBySlug(slug: string): Promise<CTPCategory | null> {
  const data = await ctpFetch<PagedQueryResult<CTPCategory>>('/categories', {
    query: {
      where: `slug(${LOCALE}="${slug}")`,
      limit: 1,
    },
    revalidate: 300,
  });
  return data.results[0] ?? null;
}

export interface ListProductsOptions {
  limit?: number;
  offset?: number;
  categoryId?: string;
  sort?: string;
}

export async function listProducts(options: ListProductsOptions = {}): Promise<{ products: Product[]; total: number }> {
  const { limit = 24, offset = 0, categoryId, sort } = options;
  const query: Record<string, string | number | string[]> = {
    limit,
    offset,
    priceCurrency: 'USD',
    priceCountry: 'US',
  };
  if (sort) query.sort = sort;
  if (categoryId) {
    query['filter.query'] = `categories.id:subtree("${categoryId}")`;
  }

  const data = await ctpFetch<PagedQueryResult<CTPProductProjection>>('/product-projections/search', {
    query,
    revalidate: 60,
  });

  return {
    products: data.results.map(projectionToProduct),
    total: data.total ?? data.count,
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await ctpFetch<PagedQueryResult<CTPProductProjection>>('/product-projections', {
    query: {
      where: `slug(${LOCALE}="${slug}")`,
      limit: 1,
      priceCurrency: 'USD',
      priceCountry: 'US',
    },
    revalidate: 60,
  });
  const p = data.results[0];
  return p ? projectionToProduct(p) : null;
}

export async function searchProducts(query: string, options: { limit?: number; offset?: number } = {}): Promise<{ products: Product[]; total: number }> {
  const { limit = 24, offset = 0 } = options;
  if (!query.trim()) return { products: [], total: 0 };

  const data = await ctpFetch<PagedQueryResult<CTPProductProjection>>('/product-projections/search', {
    query: {
      [`text.${LOCALE}`]: query,
      fuzzy: true,
      limit,
      offset,
      priceCurrency: 'USD',
      priceCountry: 'US',
    },
    revalidate: 30,
  });

  return {
    products: data.results.map(projectionToProduct),
    total: data.total ?? data.count,
  };
}
