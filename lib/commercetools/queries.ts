import "server-only";

import type { Product } from "@/types/entity/product";
import type { Category } from "@/types/entity/category";
import { api, hasCommercetoolsCredentials } from "./client";
import {
  DEFAULT_TENANT,
  type TenantContext,
  buildCategoryTree,
  normaliseCategory,
  normaliseProduct,
} from "./normalize";
import {
  fallbackCategories,
  fallbackProduct,
  fallbackProducts,
  fallbackSearch,
  warnFallback,
} from "./fallback";

export interface ListProductsOptions extends Partial<TenantContext> {
  limit?: number;
  offset?: number;
  categoryId?: string;
}

export interface SearchProductsOptions extends Partial<TenantContext> {
  query: string;
  limit?: number;
  offset?: number;
  filters?: string[];
}

type QueryParam = boolean | number | string | string[] | undefined;

function tenantOf(opts: Partial<TenantContext> | undefined): TenantContext {
  return {
    locale: opts?.locale ?? DEFAULT_TENANT.locale,
    currency: opts?.currency ?? DEFAULT_TENANT.currency,
    country: opts?.country ?? DEFAULT_TENANT.country,
  };
}

export async function listProducts(opts: ListProductsOptions = {}): Promise<Product[]> {
  if (!hasCommercetoolsCredentials()) {
    warnFallback();
    return fallbackProducts().slice(0, opts.limit ?? 12);
  }
  const tenant = tenantOf(opts);
  const queryArgs: Record<string, QueryParam> = {
    limit: opts.limit ?? 12,
    offset: opts.offset,
    expand: ["categories[*]"],
    priceCurrency: tenant.currency,
    priceCountry: tenant.country,
    staged: false,
  };
  if (opts.categoryId) {
    queryArgs.where = `categories(id="${opts.categoryId}")`;
  }
  const res = await api().productProjections().get({ queryArgs }).execute();
  return res.body.results.map((p) => normaliseProduct(p, tenant));
}

export async function getProduct(
  idOrKey: string,
  opts: Partial<TenantContext> = {},
): Promise<Product | null> {
  if (!hasCommercetoolsCredentials()) {
    warnFallback();
    return fallbackProduct(idOrKey);
  }
  const tenant = tenantOf(opts);
  const queryArgs = {
    expand: ["categories[*]"],
    priceCurrency: tenant.currency,
    priceCountry: tenant.country,
    staged: false,
  };
  try {
    const looksLikeId = /^[0-9a-f-]{8,}$/i.test(idOrKey);
    const builder = looksLikeId
      ? api().productProjections().withId({ ID: idOrKey })
      : api().productProjections().withKey({ key: idOrKey });
    const res = await builder.get({ queryArgs }).execute();
    return normaliseProduct(res.body, tenant);
  } catch (err) {
    console.error(`[commercetools] getProduct failed for ${idOrKey}:`, err);
    return null;
  }
}

export async function getProductBySlug(
  slug: string,
  opts: Partial<TenantContext> = {},
): Promise<Product | null> {
  if (!hasCommercetoolsCredentials()) {
    warnFallback();
    return fallbackProduct(slug);
  }
  const tenant = tenantOf(opts);
  const queryArgs: Record<string, QueryParam> = {
    where: `slug(${tenant.locale}="${slug}")`,
    limit: 1,
    expand: ["categories[*]"],
    priceCurrency: tenant.currency,
    priceCountry: tenant.country,
    staged: false,
  };
  try {
    const res = await api().productProjections().get({ queryArgs }).execute();
    const hit = res.body.results[0];
    return hit ? normaliseProduct(hit, tenant) : null;
  } catch (err) {
    console.error(`[commercetools] getProductBySlug failed for ${slug}:`, err);
    return null;
  }
}

export interface ListCategoriesOptions extends Partial<TenantContext> {
  format?: "flat" | "tree";
  limit?: number;
}

export async function listCategories(opts: ListCategoriesOptions = {}): Promise<Category[]> {
  if (!hasCommercetoolsCredentials()) {
    warnFallback();
    return fallbackCategories();
  }
  const tenant = tenantOf(opts);
  const res = await api()
    .categories()
    .get({ queryArgs: { limit: opts.limit ?? 100 } })
    .execute();
  const flat = res.body.results.map((c) => normaliseCategory(c, tenant));
  if (opts.format === "tree") return buildCategoryTree(flat, res.body.results);
  return flat;
}

export async function searchProducts(opts: SearchProductsOptions): Promise<Product[]> {
  if (!hasCommercetoolsCredentials()) {
    warnFallback();
    return fallbackSearch(opts.query).slice(0, opts.limit ?? 12);
  }
  const tenant = tenantOf(opts);
  const queryArgs: Record<string, QueryParam> = {
    limit: opts.limit ?? 12,
    offset: opts.offset,
    [`text.${tenant.locale}`]: opts.query,
    fuzzy: true,
    expand: ["categories[*]"],
    priceCurrency: tenant.currency,
    priceCountry: tenant.country,
    staged: false,
  };
  if (opts.filters && opts.filters.length > 0) {
    queryArgs.filter = opts.filters;
  }
  const res = await api().productProjections().search().get({ queryArgs }).execute();
  return res.body.results.map((p) => normaliseProduct(p, tenant));
}
