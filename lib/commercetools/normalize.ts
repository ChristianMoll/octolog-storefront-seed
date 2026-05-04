import "server-only";

import type {
  Category as CtCategory,
  ProductProjection,
} from "@commercetools/platform-sdk";
import type { Product } from "@/types/entity/product";
import type { Category } from "@/types/entity/category";
import { isCurrency } from "@/types/entity/currency";

export interface TenantContext {
  locale: string;
  currency: string;
  country: string;
}

export const DEFAULT_TENANT: TenantContext = {
  locale: process.env.CTP_DEFAULT_LOCALE ?? "en-US",
  currency: process.env.CTP_DEFAULT_CURRENCY ?? "USD",
  country: process.env.CTP_DEFAULT_COUNTRY ?? "US",
};

function localized<T extends Record<string, unknown>>(
  field: T | undefined,
  locale: string,
): string | undefined {
  if (!field) return undefined;
  const direct = field[locale];
  if (typeof direct === "string") return direct;
  const first = Object.values(field)[0];
  return typeof first === "string" ? first : undefined;
}

export function normaliseProduct(p: ProductProjection, tenant: TenantContext): Product {
  const name = localized(p.name, tenant.locale) ?? "Untitled";
  const description = localized(p.description, tenant.locale);
  const mv = p.masterVariant;

  const images = mv.images?.map((img) => img.url);

  const priceEntry =
    mv.price ??
    mv.prices?.find((pr) => pr.value.currencyCode === tenant.currency) ??
    mv.prices?.[0];
  const priceObj = priceEntry?.value;
  const validCurrency =
    priceObj && isCurrency(priceObj.currencyCode) ? priceObj.currencyCode : undefined;
  const fractionDigits =
    priceObj && "fractionDigits" in priceObj
      ? (priceObj as { fractionDigits: number }).fractionDigits
      : 2;
  const FALLBACK_PRICE = 9999.99;
  const price =
    priceObj && validCurrency
      ? priceObj.centAmount / Math.pow(10, fractionDigits)
      : FALLBACK_PRICE;
  const currency =
    validCurrency ?? (isCurrency(tenant.currency) ? tenant.currency : undefined);

  const discountedObj = priceEntry?.discounted?.value;
  const discountedFd =
    discountedObj && "fractionDigits" in discountedObj
      ? (discountedObj as { fractionDigits: number }).fractionDigits
      : 2;
  const discountedPrice = discountedObj
    ? discountedObj.centAmount / Math.pow(10, discountedFd)
    : undefined;

  const specifications = mv.attributes?.map((a) => ({
    label: a.name,
    value: typeof a.value === "string" ? a.value : JSON.stringify(a.value),
  }));

  const avail = mv.availability;
  const inStock = avail?.isOnStock;
  const quantity = avail?.availableQuantity;
  const restockableInDays = avail?.restockableInDays;

  const categories = p.categories.map((ref) => {
    const obj = ref.obj;
    const catName = obj ? localized(obj.name, tenant.locale) : undefined;
    const catSlug = obj?.slug ? localized(obj.slug, tenant.locale) : undefined;
    return {
      categoryId: ref.id,
      name: catName ?? ref.id,
      link: catSlug ? `/${catSlug}` : `/${ref.id}`,
      paths: {},
      descendants: [],
    } satisfies Category;
  });

  const slug = localized(p.slug, tenant.locale);
  const url = slug ? `/${slug}` : undefined;

  return {
    id: p.id,
    key: p.key,
    ref: p.id,
    sku: mv.sku ?? p.id,
    name,
    description,
    specifications,
    images,
    price,
    discountedPrice,
    currency,
    inStock,
    quantity,
    restockableInDays,
    categories: categories.length > 0 ? categories : undefined,
    url,
  };
}

export function normaliseCategory(c: CtCategory, tenant: TenantContext): Category {
  const name = localized(c.name, tenant.locale) ?? c.id;
  const slug = localized(c.slug, tenant.locale);
  return {
    categoryId: c.id,
    categoryKey: c.key,
    categoryRef: c.id,
    name,
    link: slug ? `/${slug}` : `/${c.id}`,
    paths: {},
    descendants: [],
  };
}

export function buildCategoryTree(categories: Category[], raw: CtCategory[]): Category[] {
  const byId = new Map<string, Category>();
  categories.forEach((c) => byId.set(c.categoryId, { ...c, descendants: [] }));
  const roots: Category[] = [];
  raw.forEach((src) => {
    const node = byId.get(src.id);
    if (!node) return;
    const parentId = src.parent?.id;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.descendants.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}
