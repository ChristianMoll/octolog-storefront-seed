#!/usr/bin/env bash
# Prepend the AGENTS.md preamble to the generated catalog markdown.
# Usage: ./render-agents-md.sh path/to/scaffold-catalog.md
set -euo pipefail

CATALOG="$1"
if [[ ! -f "$CATALOG" ]]; then
  echo "Catalog not found at $CATALOG" >&2
  exit 1
fi

cat <<'EOF'
# AGENTS — Storefront build instructions

You are building a Next.js 16 + React 19 storefront. The design system at
`@scaffold` is pre-installed (vendored at `vendor/scaffold/`). Use it for
everything — do NOT write raw HTML or Tailwind divs where a component exists.

## Hard rules

- Import components from `@scaffold` (e.g. `import { Button, ProductTile } from '@scaffold'`).
- Do NOT modify `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, or anything inside `vendor/`.
- Do NOT add new npm dependencies — everything you need is in `package.json`.
- Pages live under `app/`. Use the Next.js 16 app router conventions.
- Tailwind v4 is available; CSS Modules work too. Prefer scaffold components over
  inline Tailwind for anything substantive.
- The Header `logo` prop must use a path under `/public/` that actually exists
  in the seed (e.g. `{ src: '/logo.svg', width: 120, height: 32 }`). A
  placeholder logo is shipped at `public/logo.svg` — use it unless the user
  has supplied a real brand asset. Do NOT invent absolute URLs to
  `commercetools.com` or any other external CDN, and do NOT use
  `/sb-assets/...` paths — those are Storybook-only and do not ship to the
  storefront.

## Routing conventions

The scaffold is configured single-locale. Routes are flat — do NOT add a
`[locale]` segment, do NOT prefix any href with a locale, and do NOT add
`next-intl` middleware. Use these canonical paths:

- **Product detail** → `app/p/[slug]/page.tsx` resolves at `/p/<slug>`. When
  normalising commercetools data into the scaffold's `Product` shape, set
  `Product.url = `/p/${slug}``. Components like `ProductTile` link via
  `Product.url`, so an unset value silently produces an `href="#"`.
- **Category** → `app/c/[slug]/page.tsx` resolves at `/c/<slug>`. When
  building `categoryLinks` for `Header`, set each entry's `link` field to
  `/c/${slug}` (and `paths` likewise if present). Categories without a
  `link` will navigate to `/`.
- **Search** → `app/search/page.tsx` reads `searchParams.q`. The `Search`
  component's `handleSearchAction` should navigate to `/search?q=<query>`.
- **Home** → `app/page.tsx`. Hero CTAs that "shop" the catalog should point
  at `/search` or a relevant `/c/<slug>`.

Do not invent route shapes (`/products/...`, `/category/...`, `/en/...`).
Stick to `/p/[slug]`, `/c/[slug]`, `/search`.

## Data sourcing

Real commercetools data is available at runtime. The env vars `CTP_API_URL`,
`CTP_AUTH_URL`, `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET`, `CTP_PROJECT_KEY`,
`CTP_SCOPES` are pre-configured by the platform — do NOT hardcode them, write
`.env` files, or commit credentials.

Hard rules:

- **Do NOT invent product, category, price, or image data.** Use the helpers in
  `lib/commercetools/queries.ts`:
  - `listProducts({ limit?, offset?, categoryId?, currency?, country?, locale? })`
  - `getProduct(idOrKey, { currency?, country?, locale? })`
  - `listCategories({ format?: 'flat' | 'tree' })`
  - `searchProducts({ query, limit?, filters?, currency?, country?, locale? })`
- These are server-only. Call them from server components (the default in
  `app/`) or from Route Handlers. Never call them from a `'use client'` file.
- Pattern: a server component fetches data → passes it as props to a client
  component that does the rendering. Scaffold components like `ProductTile`
  use hooks, so the rendering layer is `'use client'`.
- If credentials are missing locally, the helpers return a tiny in-memory
  fallback so `next dev` still renders. Do NOT rely on the fallback for the
  agent's own output — the agent's storefront should assume real data is
  available.
- The helpers never throw. On any error (network, auth, malformed response,
  missing field) they log to stderr and return `[]` (or `null` for
  `getProduct`). Don't wrap calls in your own `try`/`catch`, and do render a
  graceful empty state for the `[]` case instead of assuming results exist.

Example — homepage listing real products:

```tsx
// app/page.tsx (server component, no 'use client')
import { listProducts } from '@lib/commercetools/queries';
import ProductGrid from './ProductGrid';

export default async function Page() {
  const products = await listProducts({ limit: 12 });
  return <ProductGrid products={products} />;
}
```

```tsx
// app/ProductGrid.tsx
'use client';
import { ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductTile key={p.id} item={p} variant="grid-item" />
      ))}
    </div>
  );
}
```

Example — search page reading the `q` query param. Note the empty-state
handling: `searchProducts` returns `[]` for both "no query" and "query had
zero matches" (and also for any underlying SDK failure), so the page must
render something for that case.

```tsx
// app/search/page.tsx
import { searchProducts } from '@lib/commercetools/queries';
import ProductGrid from '../ProductGrid';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const products = q ? await searchProducts({ query: q, limit: 24 }) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        {q ? `Search results for "${q}"` : 'Search'}
      </h1>
      {q && products.length === 0 ? (
        <p className="text-neutral-600">No products matched "{q}".</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
```

## Component priority list

These cover most storefronts. Reach for them first; consult the full catalog
below for the rest.

- Layout: `Header`, `Footer`, `AnnouncementBar`
- Discovery: `HeroTile`, `ProductSlider`, `ProductTile`, `ProductList`, `Search`
- Detail: `ProductDetails`, `Gallery`, `ProductAttributes`
- Cart/checkout: `Cart`, `Checkout`, `OrderSummary`, `Confirmation`, `ThankYou`
- Content: `Banner`, `ContentTile`, `ContentSlider`, `Card`, `Accordion`
- Form atoms: `Input`, `Button`, `Checkbox`, `Radio`, `Select`, `Toggle`

If a component you need is not in the catalog, prefer composing existing atoms
over reinventing it.

---

EOF

cat "$CATALOG"
