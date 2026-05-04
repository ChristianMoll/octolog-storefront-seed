import "server-only";

import type { Product } from "@/types/entity/product";
import type { Category } from "@/types/entity/category";

let warned = false;
export function warnFallback(): void {
  if (warned) return;
  warned = true;
  console.warn(
    "[commercetools] CTP_* env vars not set — serving in-memory fallback fixture. " +
      "Set CTP_API_URL, CTP_AUTH_URL, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_PROJECT_KEY, " +
      "CTP_SCOPES to fetch real data.",
  );
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    categoryId: "fallback-cat-apparel",
    categoryKey: "apparel",
    name: "Apparel",
    link: "/apparel",
    paths: {},
    descendants: [],
  },
  {
    categoryId: "fallback-cat-accessories",
    categoryKey: "accessories",
    name: "Accessories",
    link: "/accessories",
    paths: {},
    descendants: [],
  },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-product-tee",
    key: "fallback-tee",
    ref: "fallback-product-tee",
    sku: "FB-TEE-001",
    name: "Fallback Tee",
    description: "Sample product served because no CTP credentials are configured.",
    specifications: [{ label: "material", value: "100% cotton" }],
    images: ["/sb-assets/engine.png"],
    price: 24.95,
    currency: "USD",
    inStock: true,
    quantity: 42,
    categories: [FALLBACK_CATEGORIES[0]],
    url: "/fallback-tee",
  },
  {
    id: "fallback-product-tote",
    key: "fallback-tote",
    ref: "fallback-product-tote",
    sku: "FB-TOTE-001",
    name: "Fallback Tote",
    description: "Sample product served because no CTP credentials are configured.",
    specifications: [{ label: "capacity", value: "12L" }],
    images: ["/sb-assets/engine.png"],
    price: 18.0,
    currency: "USD",
    inStock: true,
    quantity: 17,
    categories: [FALLBACK_CATEGORIES[1]],
    url: "/fallback-tote",
  },
];

export function fallbackProducts(): Product[] {
  return FALLBACK_PRODUCTS;
}

export function fallbackProduct(idOrKey: string): Product | null {
  return (
    FALLBACK_PRODUCTS.find((p) => p.id === idOrKey || p.key === idOrKey) ?? FALLBACK_PRODUCTS[0]
  );
}

export function fallbackCategories(): Category[] {
  return FALLBACK_CATEGORIES;
}

export function fallbackSearch(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return FALLBACK_PRODUCTS;
  return FALLBACK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q),
  );
}
