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
