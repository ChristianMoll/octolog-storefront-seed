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

Example — search page reading the `q` query param:

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
  return <ProductGrid products={products} />;
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

# Scaffold Component Catalog

Auto-generated from `packages/launchpad/src/components/scaffold/`. Do not edit by hand.

All components are imported from `@scaffold`:

```tsx
import { Button, Card, ProductTile } from '@scaffold';
```

## Atoms

### Button

**Import:** `import { Button } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/button`
**Inherits:** `React.ComponentProps<'button'>`

| Prop | Type | Required |
|------|------|----------|
| `variant` | `'primary' \| 'secondary' \| 'underlined' \| 'ghost' \| 'warning'` | no |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'fit' \| 'full'` | no |
| `iconPosition` | `'left' \| 'right'` | no |
| `Icon` | `React.ForwardRefExoticComponent< Omit<React.SVGProps<SVGSVGElement>, 'ref'> & { title?: string \| undefined; titleId?: string \| undefined; } & React.RefAttributes<SVGSVGElement> >` | no |
| `loading` | `boolean` | no |
| `added` | `boolean` | no |
| `asSkeleton` | `boolean` | no |

```tsx
<Button size='xs' />
```

### Checkbox

**Import:** `import { Checkbox } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/checkbox`
**Inherits:** `Omit<React.ComponentProps<'input'>, 'size'>`

| Prop | Type | Required |
|------|------|----------|
| `containerClassName` | `string` | no |
| `size` | `'sm' \| 'lg'` | no |
| `label` | `ReactNode` | no |
| `onChecked` | `(val: boolean) => void` | no |

```tsx
<Checkbox label='Text' />
```

### ColoredVariants

**Import:** `import { ColoredVariants } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/colored-variants`

### Dropdown

**Import:** `import { Dropdown } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/dropdown`

| Prop | Type | Required |
|------|------|----------|
| `size` | `'sm' \| 'lg'` | no |
| `disabled` | `boolean` | no |
| `className` | `string` | no |
| `value` | `string` | no |
| `defaultValue` | `string` | no |
| `onChange` | `(value: string) => void` | no |

```tsx
<Dropdown />
```

### FlagIcon

**Import:** `import { FlagIcon } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/icons`

### FlagIconSquare

**Import:** `import { FlagIconSquare } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/icons`

### Image

**Import:** `import { Image } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/Image`

| Prop | Type | Required |
|------|------|----------|
| `alt` | `string` | yes |
| `crossOrigin` | `'' \| 'anonymous' \| 'use-credentials'` | no |
| `decoding` | `"async" \| "auto" \| "sync" \| undefined` | no |
| `fetchPriority` | `"high" \| "low" \| "auto"` | no |
| `height` | `number` | no |
| `loading` | `"lazy" \| "eager"` | no |
| `referrerPolicy` | `HTMLAttributeReferrerPolicy \| undefined` | no |
| `sizes` | `string` | no |
| `srcSet` | `string \| undefined` | no |
| `useMap` | `string \| undefined` | no |
| `width` | `number` | no |
| `defaultChecked` | `boolean \| undefined` | no |
| `defaultValue` | `string \| number \| readonly string[] \| undefined` | no |
| `suppressContentEditableWarning` | `boolean \| undefined` | no |
| `suppressHydrationWarning` | `boolean \| undefined` | no |
| `accessKey` | `string \| undefined` | no |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| undefined \| (string & {})` | no |
| `autoFocus` | `boolean \| undefined` | no |
| `className` | `string` | no |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` | no |
| `contextMenu` | `string \| undefined` | no |
| `dir` | `string \| undefined` | no |
| `draggable` | `Booleanish \| undefined` | no |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` | no |
| `hidden` | `boolean \| undefined` | no |
| `id` | `string \| undefined` | no |
| `lang` | `string \| undefined` | no |
| `nonce` | `string \| undefined` | no |
| `slot` | `string \| undefined` | no |
| `spellCheck` | `Booleanish \| undefined` | no |
| `style` | `React.CSSProperties` | no |
| `tabIndex` | `number \| undefined` | no |
| `translate` | `"yes" \| "no" \| undefined` | no |
| `radioGroup` | `string \| undefined` | no |
| `role` | `AriaRole \| undefined` | no |
| `about` | `string \| undefined` | no |
| `content` | `string \| undefined` | no |
| `datatype` | `string \| undefined` | no |
| `inlist` | `any` | no |
| `prefix` | `string \| undefined` | no |
| `property` | `string \| undefined` | no |
| `rel` | `string \| undefined` | no |
| `resource` | `string \| undefined` | no |
| `rev` | `string \| undefined` | no |
| `typeof` | `string \| undefined` | no |
| `vocab` | `string \| undefined` | no |
| `autoCorrect` | `string \| undefined` | no |
| `autoSave` | `string \| undefined` | no |
| `color` | `string \| undefined` | no |
| `itemProp` | `string \| undefined` | no |
| `itemScope` | `boolean \| undefined` | no |
| `itemType` | `string \| undefined` | no |
| `itemID` | `string \| undefined` | no |
| `itemRef` | `string \| undefined` | no |
| `results` | `number \| undefined` | no |
| `security` | `string \| undefined` | no |
| `unselectable` | `"on" \| "off" \| undefined` | no |
| `popover` | `"" \| "auto" \| "manual" \| "hint" \| undefined` | no |
| `popoverTargetAction` | `"toggle" \| "show" \| "hide" \| undefined` | no |
| `popoverTarget` | `string \| undefined` | no |
| `inert` | `boolean \| undefined` | no |
| `inputMode` | `"none" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| "search" \| undefined` | no |
| `is` | `string \| undefined` | no |
| `exportparts` | `string \| undefined` | no |
| `part` | `string \| undefined` | no |
| `aria-activedescendant` | `string \| undefined` | no |
| `aria-atomic` | `Booleanish \| undefined` | no |
| `aria-autocomplete` | `"none" \| "inline" \| "list" \| "both" \| undefined` | no |
| `aria-braillelabel` | `string \| undefined` | no |
| `aria-brailleroledescription` | `string \| undefined` | no |
| `aria-busy` | `Booleanish \| undefined` | no |
| `aria-checked` | `boolean \| "false" \| "mixed" \| "true" \| undefined` | no |
| `aria-colcount` | `number \| undefined` | no |
| `aria-colindex` | `number \| undefined` | no |
| `aria-colindextext` | `string \| undefined` | no |
| `aria-colspan` | `number \| undefined` | no |
| `aria-controls` | `string \| undefined` | no |
| `aria-current` | `boolean \| "false" \| "true" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | no |
| `aria-describedby` | `string \| undefined` | no |
| `aria-description` | `string \| undefined` | no |
| `aria-details` | `string \| undefined` | no |
| `aria-disabled` | `Booleanish \| undefined` | no |
| `aria-dropeffect` | `"none" \| "copy" \| "execute" \| "link" \| "move" \| "popup" \| undefined` | no |
| `aria-errormessage` | `string \| undefined` | no |
| `aria-expanded` | `Booleanish \| undefined` | no |
| `aria-flowto` | `string \| undefined` | no |
| `aria-grabbed` | `Booleanish \| undefined` | no |
| `aria-haspopup` | `boolean \| "false" \| "true" \| "menu" \| "listbox" \| "tree" \| "grid" \| "dialog" \| undefined` | no |
| `aria-hidden` | `Booleanish \| undefined` | no |
| `aria-invalid` | `boolean \| "false" \| "true" \| "grammar" \| "spelling" \| undefined` | no |
| `aria-keyshortcuts` | `string \| undefined` | no |
| `aria-label` | `string \| undefined` | no |
| `aria-labelledby` | `string \| undefined` | no |
| `aria-level` | `number \| undefined` | no |
| `aria-live` | `"off" \| "assertive" \| "polite" \| undefined` | no |
| `aria-modal` | `Booleanish \| undefined` | no |
| `aria-multiline` | `Booleanish \| undefined` | no |
| `aria-multiselectable` | `Booleanish \| undefined` | no |
| `aria-orientation` | `"horizontal" \| "vertical" \| undefined` | no |
| `aria-owns` | `string \| undefined` | no |
| `aria-placeholder` | `string \| undefined` | no |
| `aria-posinset` | `number \| undefined` | no |
| `aria-pressed` | `boolean \| "false" \| "mixed" \| "true" \| undefined` | no |
| `aria-readonly` | `Booleanish \| undefined` | no |
| `aria-relevant` | `\| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text" \| "text additions" \| "text removals" \| undefined` | no |
| `aria-required` | `Booleanish \| undefined` | no |
| `aria-roledescription` | `string \| undefined` | no |
| `aria-rowcount` | `number \| undefined` | no |
| `aria-rowindex` | `number \| undefined` | no |
| `aria-rowindextext` | `string \| undefined` | no |
| `aria-rowspan` | `number \| undefined` | no |
| `aria-selected` | `Booleanish \| undefined` | no |
| `aria-setsize` | `number \| undefined` | no |
| `aria-sort` | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | no |
| `aria-valuemax` | `number \| undefined` | no |
| `aria-valuemin` | `number \| undefined` | no |
| `aria-valuenow` | `number \| undefined` | no |
| `aria-valuetext` | `string \| undefined` | no |
| `children` | `React.ReactNode` | no |
| `dangerouslySetInnerHTML` | `{ // Should be InnerHTML['innerHTML']. // But unfortunately we're mixing renderer-specific type declarations. __html: string \| TrustedHTML; } \| undefined` | no |
| `onCopy` | `ClipboardEventHandler<T> \| undefined` | no |
| `onCopyCapture` | `ClipboardEventHandler<T> \| undefined` | no |
| `onCut` | `ClipboardEventHandler<T> \| undefined` | no |
| `onCutCapture` | `ClipboardEventHandler<T> \| undefined` | no |
| `onPaste` | `ClipboardEventHandler<T> \| undefined` | no |
| `onPasteCapture` | `ClipboardEventHandler<T> \| undefined` | no |
| `onCompositionEnd` | `CompositionEventHandler<T> \| undefined` | no |
| `onCompositionEndCapture` | `CompositionEventHandler<T> \| undefined` | no |
| `onCompositionStart` | `CompositionEventHandler<T> \| undefined` | no |
| `onCompositionStartCapture` | `CompositionEventHandler<T> \| undefined` | no |
| `onCompositionUpdate` | `CompositionEventHandler<T> \| undefined` | no |
| `onCompositionUpdateCapture` | `CompositionEventHandler<T> \| undefined` | no |
| `onFocus` | `FocusEventHandler<T> \| undefined` | no |
| `onFocusCapture` | `FocusEventHandler<T> \| undefined` | no |
| `onBlur` | `FocusEventHandler<T> \| undefined` | no |
| `onBlurCapture` | `FocusEventHandler<T> \| undefined` | no |
| `onChange` | `ChangeEventHandler<T> \| undefined` | no |
| `onChangeCapture` | `ChangeEventHandler<T> \| undefined` | no |
| `onBeforeInput` | `InputEventHandler<T> \| undefined` | no |
| `onBeforeInputCapture` | `InputEventHandler<T> \| undefined` | no |
| `onInput` | `InputEventHandler<T> \| undefined` | no |
| `onInputCapture` | `InputEventHandler<T> \| undefined` | no |
| `onReset` | `ReactEventHandler<T> \| undefined` | no |
| `onResetCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onSubmit` | `SubmitEventHandler<T> \| undefined` | no |
| `onSubmitCapture` | `SubmitEventHandler<T> \| undefined` | no |
| `onInvalid` | `ReactEventHandler<T> \| undefined` | no |
| `onInvalidCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onLoad` | `(e: React.SyntheticEvent<HTMLImageElement>) => void` | no |
| `onLoadCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onError` | `ReactEventHandler<T> \| undefined` | no |
| `onErrorCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onKeyDown` | `KeyboardEventHandler<T> \| undefined` | no |
| `onKeyDownCapture` | `KeyboardEventHandler<T> \| undefined` | no |
| `onKeyPress` | `KeyboardEventHandler<T> \| undefined` | no |
| `onKeyPressCapture` | `KeyboardEventHandler<T> \| undefined` | no |
| `onKeyUp` | `KeyboardEventHandler<T> \| undefined` | no |
| `onKeyUpCapture` | `KeyboardEventHandler<T> \| undefined` | no |
| `onAbort` | `ReactEventHandler<T> \| undefined` | no |
| `onAbortCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onCanPlay` | `ReactEventHandler<T> \| undefined` | no |
| `onCanPlayCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onCanPlayThrough` | `ReactEventHandler<T> \| undefined` | no |
| `onCanPlayThroughCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onDurationChange` | `ReactEventHandler<T> \| undefined` | no |
| `onDurationChangeCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onEmptied` | `ReactEventHandler<T> \| undefined` | no |
| `onEmptiedCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onEncrypted` | `ReactEventHandler<T> \| undefined` | no |
| `onEncryptedCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onEnded` | `ReactEventHandler<T> \| undefined` | no |
| `onEndedCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onLoadedData` | `ReactEventHandler<T> \| undefined` | no |
| `onLoadedDataCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onLoadedMetadata` | `ReactEventHandler<T> \| undefined` | no |
| `onLoadedMetadataCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onLoadStart` | `ReactEventHandler<T> \| undefined` | no |
| `onLoadStartCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onPause` | `ReactEventHandler<T> \| undefined` | no |
| `onPauseCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onPlay` | `ReactEventHandler<T> \| undefined` | no |
| `onPlayCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onPlaying` | `ReactEventHandler<T> \| undefined` | no |
| `onPlayingCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onProgress` | `ReactEventHandler<T> \| undefined` | no |
| `onProgressCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onRateChange` | `ReactEventHandler<T> \| undefined` | no |
| `onRateChangeCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onSeeked` | `ReactEventHandler<T> \| undefined` | no |
| `onSeekedCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onSeeking` | `ReactEventHandler<T> \| undefined` | no |
| `onSeekingCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onStalled` | `ReactEventHandler<T> \| undefined` | no |
| `onStalledCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onSuspend` | `ReactEventHandler<T> \| undefined` | no |
| `onSuspendCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onTimeUpdate` | `ReactEventHandler<T> \| undefined` | no |
| `onTimeUpdateCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onVolumeChange` | `ReactEventHandler<T> \| undefined` | no |
| `onVolumeChangeCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onWaiting` | `ReactEventHandler<T> \| undefined` | no |
| `onWaitingCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onAuxClick` | `MouseEventHandler<T> \| undefined` | no |
| `onAuxClickCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onClick` | `MouseEventHandler<T> \| undefined` | no |
| `onClickCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onContextMenu` | `MouseEventHandler<T> \| undefined` | no |
| `onContextMenuCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onDoubleClick` | `MouseEventHandler<T> \| undefined` | no |
| `onDoubleClickCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onDrag` | `DragEventHandler<T> \| undefined` | no |
| `onDragCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDragEnd` | `DragEventHandler<T> \| undefined` | no |
| `onDragEndCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDragEnter` | `DragEventHandler<T> \| undefined` | no |
| `onDragEnterCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDragExit` | `DragEventHandler<T> \| undefined` | no |
| `onDragExitCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDragLeave` | `DragEventHandler<T> \| undefined` | no |
| `onDragLeaveCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDragOver` | `DragEventHandler<T> \| undefined` | no |
| `onDragOverCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDragStart` | `DragEventHandler<T> \| undefined` | no |
| `onDragStartCapture` | `DragEventHandler<T> \| undefined` | no |
| `onDrop` | `DragEventHandler<T> \| undefined` | no |
| `onDropCapture` | `DragEventHandler<T> \| undefined` | no |
| `onMouseDown` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseDownCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseEnter` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseLeave` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseMove` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseMoveCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseOut` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseOutCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseOver` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseOverCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseUp` | `MouseEventHandler<T> \| undefined` | no |
| `onMouseUpCapture` | `MouseEventHandler<T> \| undefined` | no |
| `onSelect` | `ReactEventHandler<T> \| undefined` | no |
| `onSelectCapture` | `ReactEventHandler<T> \| undefined` | no |
| `onTouchCancel` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchCancelCapture` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchEnd` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchEndCapture` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchMove` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchMoveCapture` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchStart` | `TouchEventHandler<T> \| undefined` | no |
| `onTouchStartCapture` | `TouchEventHandler<T> \| undefined` | no |
| `onPointerDown` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerDownCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerMove` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerMoveCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerUp` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerUpCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerCancel` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerCancelCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerEnter` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerLeave` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerOver` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerOverCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerOut` | `PointerEventHandler<T> \| undefined` | no |
| `onPointerOutCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onGotPointerCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onGotPointerCaptureCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onLostPointerCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onLostPointerCaptureCapture` | `PointerEventHandler<T> \| undefined` | no |
| `onScroll` | `UIEventHandler<T> \| undefined` | no |
| `onScrollCapture` | `UIEventHandler<T> \| undefined` | no |
| `onScrollEnd` | `UIEventHandler<T> \| undefined` | no |
| `onScrollEndCapture` | `UIEventHandler<T> \| undefined` | no |
| `onWheel` | `WheelEventHandler<T> \| undefined` | no |
| `onWheelCapture` | `WheelEventHandler<T> \| undefined` | no |
| `onAnimationStart` | `AnimationEventHandler<T> \| undefined` | no |
| `onAnimationStartCapture` | `AnimationEventHandler<T> \| undefined` | no |
| `onAnimationEnd` | `AnimationEventHandler<T> \| undefined` | no |
| `onAnimationEndCapture` | `AnimationEventHandler<T> \| undefined` | no |
| `onAnimationIteration` | `AnimationEventHandler<T> \| undefined` | no |
| `onAnimationIterationCapture` | `AnimationEventHandler<T> \| undefined` | no |
| `onToggle` | `ToggleEventHandler<T> \| undefined` | no |
| `onBeforeToggle` | `ToggleEventHandler<T> \| undefined` | no |
| `onTransitionCancel` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionCancelCapture` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionEnd` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionEndCapture` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionRun` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionRunCapture` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionStart` | `TransitionEventHandler<T> \| undefined` | no |
| `onTransitionStartCapture` | `TransitionEventHandler<T> \| undefined` | no |
| `fill` | `boolean` | no |
| `loader` | `(p: { src: string; width: number; quality?: number }) => string` | no |
| `quality` | `number` | no |
| `priority` | `boolean` | no |
| `placeholder` | `"blur" \| "empty"` | no |
| `blurDataURL` | `string` | no |
| `src` | `string` | no |
| `suffix` | `string` | no |
| `ratio` | `string` | no |
| `media` | `{ mediaId?: string; name?: string; width?: number; height?: number; }` | no |
| `gravity` | `{ mode?: string; coordinates?: { x?: number; y?: number }; }` | no |
| `title` | `string` | no |

```tsx
<Image media={{
    mediaId: image.mediaId,
    name: image.name,
    file: image.url,
    resourceType: 'image',
    tags: [],
    size: 516362,
    width: 1378,
    height: 1378,
  }} />
```

### InfoTooltip

**Import:** `import { InfoTooltip } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/info-tooltip`
**Inherits:** `React.ComponentProps<typeof Tooltip>`

| Prop | Type | Required |
|------|------|----------|
| `content` | `string` | no |
| `icon` | `React.ComponentType` | no |
| `iconWidth` | `number` | no |
| `iconHeight` | `number` | no |
| `className` | `string` | no |

```tsx
<InfoTooltip content="I'm a tooltip!" place='top-end'>Hover me!</InfoTooltip>
```

### Input

**Import:** `import { Input } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/input`
**Inherits:** `React.ComponentProps<'input'>`, `Pick<LabelProps, 'requiredStyle' | 'showOptionalLabel' | 'optionalLabel'>`

| Prop | Type | Required |
|------|------|----------|
| `label` | `string` | no |
| `valid` | `boolean` | no |
| `error` | `string` | no |
| `clearButton` | `boolean` | no |
| `onClear` | `() => void` | no |
| `icon` | `React.ReactNode` | no |
| `containerClassName` | `string` | no |
| `outerContainerClassName` | `string` | no |
| `unStyled` | `boolean` | no |
| `focusOnMount` | `boolean` | no |

```tsx
<Input disabled={true} value='Label' />
```

### Label

**Import:** `import { Label } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/label`

| Prop | Type | Required |
|------|------|----------|
| `required` | `boolean` | no |
| `requiredStyle` | `'asterisk' \| 'label'` | no |
| `showOptionalLabel` | `boolean` | no |
| `optionalLabel` | `string` | no |
| `htmlFor` | `string` | no |

```tsx
<Label>Label</Label>
```

### Link

**Import:** `import { Link } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/link`
**Inherits:** `React.ComponentProps<typeof NextLink>`

| Prop | Type | Required |
|------|------|----------|
| `openInNewTab` | `boolean` | no |
| `chevron` | `boolean` | no |
| `underlineOnHover` | `boolean` | no |
| `locale` | `string` | no |

```tsx
<Link href='#' openInNewTab={false}>Click Me!</Link>
```

### LoadingIcon

**Import:** `import { LoadingIcon } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/loading-icon`

| Prop | Type | Required |
|------|------|----------|
| `svgWidth` | `number` | yes |
| `svgHeight` | `number` | yes |
| `className` | `string` | no |

### Markdown

**Import:** `import { Markdown } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/markdown`

| Prop | Type | Required |
|------|------|----------|
| `children` | `string` | no |
| `className` | `string` | no |

```tsx
<Markdown>\n**Automotive Trends in 2023**\n*Automotive trends are evolving to meet our changing needs and desires. With a growing emphasis on driver and passenger safety, automakers are technologies such as collision warning systems, automatic braking, and adaptive cruise control.*\n</Markdown>
```

### MultiDropdown

**Import:** `import { MultiDropdown } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/multi-dropdown`

| Prop | Type | Required |
|------|------|----------|
| `size` | `'sm' \| 'lg'` | no |
| `disabled` | `boolean` | no |
| `className` | `string` | no |
| `value` | `string[]` | no |
| `defaultValue` | `string[]` | no |
| `onChange` | `(value: string[]) => void` | no |

```tsx
<MultiDropdown />
```

### MultiSelect

**Import:** `import { MultiSelect } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/multi-select`
**Inherits:** `DropdownProps`, `LabelProps`

| Prop | Type | Required |
|------|------|----------|
| `menuTop` | `boolean` | no |
| `label` | `React.ReactNode` | no |
| `placeholder` | `string` | no |
| `options` | `Option[]` | yes |
| `enableSearch` | `boolean` | no |

```tsx
<MultiSelect placeholder='Select' />
```

### Overlay

**Import:** `import { Overlay } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/overlay`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `zIndex` | `string` | no |
| `onClick` | `() => void` | no |

### PasswordInput

**Import:** `import { PasswordInput } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/password-input`

```tsx
<PasswordInput required={true} />
```

### QuantityWidget

**Import:** `import { QuantityWidget } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/quantity-widget`

| Prop | Type | Required |
|------|------|----------|
| `showLabel` | `boolean` | no |
| `value` | `number` | no |
| `defaultValue` | `number` | no |
| `minValue` | `number` | no |
| `maxValue` | `number` | no |
| `onChange` | `(val: number) => void` | no |
| `disabled` | `boolean` | no |

### Radio

**Import:** `import { Radio } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/radio`
**Inherits:** `Omit<React.ComponentProps<'input'>, 'size'>`

| Prop | Type | Required |
|------|------|----------|
| `size` | `'sm' \| 'lg'` | no |
| `label` | `ReactNode` | no |
| `onSelected` | `() => void` | no |

```tsx
<Radio label='Text' />
```

### SearchInput

**Import:** `import { SearchInput } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/search-input`

| Prop | Type | Required |
|------|------|----------|
| `ref` | `React.ForwardedRef<HTMLInputElement \| null>` | no |
| `variant` | `'xs' \| 'sm' \| 'lg'` | yes |
| `disabled` | `boolean` | no |
| `label` | `string` | no |
| `searchValue` | `string \| readonly string[] \| undefined` | no |
| `placeholder` | `string` | no |
| `mobile` | `boolean` | no |
| `focused` | `boolean` | no |
| `onFocus` | `() => void` | no |
| `onBlur` | `() => void` | no |
| `onBackClick` | `() => void` | no |
| `handleOnChange` | `(value: string) => void` | no |
| `handleSearchAction` | `() => void` | no |
| `className` | `string` | no |
| `containerClassName` | `string` | no |

```tsx
<SearchInput label='Filter Search' variant='xs' placeholder='Search...' />
```

### Select

**Import:** `import { Select } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/select`
**Inherits:** `DropdownProps`, `LabelProps`

| Prop | Type | Required |
|------|------|----------|
| `menuTop` | `boolean` | no |
| `label` | `React.ReactNode` | no |
| `placeholder` | `string` | no |
| `options` | `Option[]` | yes |
| `enableSearch` | `boolean` | no |
| `testId` | `string` | no |
| `error` | `string` | no |

```tsx
<Select placeholder='Select' />
```

### Skeleton

**Import:** `import { Skeleton } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/skeleton`

| Prop | Type | Required |
|------|------|----------|
| `count` | `number` | no |
| `duration` | `number` | no |
| `width` | `string \| number` | no |
| `height` | `string \| number` | no |
| `circle` | `boolean` | no |
| `className` | `string` | no |
| `containerClassName` | `string` | no |
| `style` | `React.CSSProperties` | no |
| `fillMode` | `boolean` | no |

```tsx
<Skeleton count={4} />
```

### Spacer

**Import:** `import { Spacer } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/spacer`

| Prop | Type | Required |
|------|------|----------|
| `bgColor` | `'white' \| 'neutral-200'` | no |
| `space` | `number \| string` | yes |

```tsx
<Spacer bgColor='neutral-200' space={24} />
```

### StockIndicator

**Import:** `import { StockIndicator } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/stock-indicator`

```tsx
<StockIndicator inStock={true} />
```

### Tag

**Import:** `import { Tag } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/tag`

| Prop | Type | Required |
|------|------|----------|
| `variant` | `'primary' \| 'secondary' \| 'warning' \| 'danger' \| 'success'` | yes |
| `className` | `string` | no |

```tsx
<Tag variant='primary'>Returned</Tag>
```

### TextArea

**Import:** `import { TextArea } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/text-area`
**Inherits:** `React.ComponentProps<'textarea'>`, `Pick<LabelProps, 'requiredStyle' | 'showOptionalLabel'>`

| Prop | Type | Required |
|------|------|----------|
| `label` | `string` | no |
| `valid` | `boolean` | no |
| `error` | `string` | no |
| `fitContent` | `boolean` | no |

```tsx
<TextArea disabled={true} value='Description' />
```

### Toaster

**Import:** `import { Toaster } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/toaster`

| Prop | Type | Required |
|------|------|----------|
| `0` | `import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant` | yes |
| `1` | `import("react-hot-toast").ToastOptions` | no |
| `length` | `2` | yes |
| `toString` | `() => string` | yes |
| `toLocaleString` | `{ (): string; (locales: string \| string[], options?: (Intl.NumberFormatOptions & Intl.DateTimeFormatOptions) \| undefined): string; }` | yes |
| `pop` | `() => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions` | no |
| `push` | `(...items: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => number` | yes |
| `concat` | `{ (...items: ConcatArray<import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined>[]): (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]; (...items: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| ConcatArray<import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined> \| undefined)[]): (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]; }` | yes |
| `join` | `(separator?: string \| undefined) => string` | yes |
| `reverse` | `() => (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]` | yes |
| `shift` | `() => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions` | no |
| `slice` | `(start?: number \| undefined, end?: number \| undefined) => (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]` | yes |
| `sort` | `(compareFn?: ((a: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, b: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined) => number) \| undefined) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").CommonProps` | yes |
| `splice` | `{ (start: number, deleteCount?: number \| undefined): (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]; (start: number, deleteCount: number, ...items: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]): (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]; }` | yes |
| `unshift` | `(...items: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => number` | yes |
| `indexOf` | `(searchElement: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, fromIndex?: number \| undefined) => number` | yes |
| `lastIndexOf` | `(searchElement: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, fromIndex?: number \| undefined) => number` | yes |
| `every` | `{ <S>(predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => value is S, thisArg?: any): this is S[]; (predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => unknown, thisArg?: any): boolean; }` | yes |
| `some` | `(predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => unknown, thisArg?: any) => boolean` | yes |
| `forEach` | `(callbackfn: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => void, thisArg?: any) => void` | yes |
| `map` | `<U>(callbackfn: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => U, thisArg?: any) => U[]` | yes |
| `filter` | `{ <S>(predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => value is S, thisArg?: any): S[]; (predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => unknown, thisArg?: any): (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]; }` | yes |
| `reduce` | `{ (callbackfn: (previousValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentIndex: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined): import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined; (callbackfn: (previousValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentIndex: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, initialValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined): import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined; <U>(callbackfn: (previousValue: U, currentValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentIndex: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => U, initialValue: U): U; }` | yes |
| `reduceRight` | `{ (callbackfn: (previousValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentIndex: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined): import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined; (callbackfn: (previousValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentIndex: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, initialValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined): import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined; <U>(callbackfn: (previousValue: U, currentValue: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, currentIndex: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => U, initialValue: U): U; }` | yes |
| `find` | `{ <S>(predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, obj: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => value is S, thisArg?: any): S \| undefined; (predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, obj: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => unknown, thisArg?: any): import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined; }` | yes |
| `findIndex` | `(predicate: (value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, obj: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => unknown, thisArg?: any) => number` | yes |
| `fill` | `(value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, start?: number \| undefined, end?: number \| undefined) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").CommonProps` | yes |
| `copyWithin` | `(target: number, start: number, end?: number \| undefined) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").CommonProps` | yes |
| `entries` | `() => ArrayIterator<[number, import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined]>` | yes |
| `keys` | `() => ArrayIterator<number>` | yes |
| `values` | `() => ArrayIterator<import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined>` | yes |
| `includes` | `(searchElement: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, fromIndex?: number \| undefined) => boolean` | yes |
| `flatMap` | `<U, This>(callback: (this: This, value: import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined, index: number, array: (import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions \| undefined)[]) => U \| readonly U[], thisArg?: This \| undefined) => U[]` | yes |
| `flat` | `<A, D>(this: A, depth?: D \| undefined) => FlatArray<A, D>[]` | yes |
| `at` | `(index: number) => import("/Users/cmoll/octolog-prototypes/packages/launchpad/src/components/scaffold/atoms/toaster/types/index").ToastVariant \| import("react-hot-toast").ToastOptions` | no |

```tsx
<Toaster onClick={() => toast.info('This is an info message')} />
```

### Toggle

**Import:** `import { Toggle } from '@scaffold';`  
**Source:** `src/components/scaffold/atoms/toggle`

| Prop | Type | Required |
|------|------|----------|
| `label` | `React.ReactNode` | no |
| `checked` | `boolean` | no |
| `defaultChecked` | `boolean` | no |
| `onChange` | `(checked: boolean) => void` | no |

```tsx
<Toggle label='Set as active' />
```

## Molecules

### Accordion

**Import:** `import { Accordion } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/accordion`
**Inherits:** `AccordionProviderProps`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |

```tsx
<Accordion />
```

### ActivityLog

**Import:** `import { ActivityLog } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/activity-log`

| Prop | Type | Required |
|------|------|----------|
| `activities` | `ActivityLog[]` | yes |
| `translations` | `{ accept?: string; decline?: string; cancel?: string; send?: string; }` | no |

```tsx
<ActivityLog activities={[
    {
      title: 'Quote request submitted',
      summary: '11/03/23 15:33 - by Erika',
      comment: 'Can I have a 10% discount on Bd10T789?',
    },
    {
      title: 'Quote Accepted by Seller',
      summary: '11/03/23 15:33 - by Anders',
      comment: 'I have applied your discount Erika!',
    },
    {
      title: 'Awaiting reply from you',
      reply: true,
      ctaLink: 'Request to Renogitiate',
    },
  ]} />
```

### AddedToCartModal

**Import:** `import { AddedToCartModal } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/added-to-cart-modal`

| Prop | Type | Required |
|------|------|----------|
| `item` | `Product` | yes |
| `onClose` | `() => void` | yes |
| `onQuantityChange` | `(amount: number) => void` | yes |
| `sliderProducts` | `Product[]` | yes |

```tsx
<AddedToCartModal item={sliderItems[0]} sliderProducts={sliderItems} />
```

### AddressForm

**Import:** `import { AddressForm } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/address-form`

| Prop | Type | Required |
|------|------|----------|
| `translations` | `{ submit?: string; cancel?: string; }` | no |
| `toasters` | `boolean` | no |
| `unstyled` | `boolean` | no |
| `countryOptions` | `(Option & { states: Option[] })[]` | yes |
| `addresses` | `Address[]` | yes |
| `showPhoneField` | `boolean` | no |
| `showCancelButton` | `boolean` | no |
| `showSubmitButton` | `boolean` | no |
| `showDefaultCheckBoxes` | `boolean` | no |
| `onAddAddress` | `(address: Address) => Promise<boolean>` | no |
| `onUpdateAddress` | `(address: Partial<Address>) => Promise<boolean>` | no |
| `onSave` | `() => void` | no |
| `onCancel` | `() => void` | no |

### Banner

**Import:** `import { Banner } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/banner`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | yes |
| `description` | `string` | no |
| `buttonText` | `string` | no |
| `buttonLink` | `Reference` | no |
| `image` | `ImageProps` | no |
| `size` | `'sm' \| 'md' \| 'lg'` | no |

```tsx
<Banner title='Lorem ipsum dolor sit amet consec tetur ' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit.' buttonText='Button text' buttonLink={{ type: 'link', link: '#' }} image={{ src: '/sb-assets/category-banner.png', alt: '' }} size='md' />
```

### Blog

**Import:** `import { Blog } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/blog`

| Prop | Type | Required |
|------|------|----------|
| `image` | `Image` | no |
| `title` | `string` | no |
| `description` | `string` | no |
| `link` | `Link` | yes |

### Breadcrumb

**Import:** `import { Breadcrumb } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/breadcrumb`

| Prop | Type | Required |
|------|------|----------|
| `Separator` | `React.ReactNode` | no |
| `className` | `string` | no |
| `disabled` | `boolean` | no |
| `maxItems` | `number` | no |

```tsx
<Breadcrumb Separator='|'>{categoryElements}</Breadcrumb>
```

### Card

**Import:** `import { Card } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/card`

| Prop | Type | Required |
|------|------|----------|
| `icon` | `ReactElement<Record<string, any>>` | yes |
| `title` | `string` | no |
| `summary` | `string` | no |

```tsx
<Card icon={<QuotesIcon />} title='Quotes' summary='Check and manage the status of quote-requests' />
```

### ContentItem

**Import:** `import { ContentItem } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/content-item`

| Prop | Type | Required |
|------|------|----------|
| `image` | `Image` | yes |
| `imageSizes` | `string` | no |
| `title` | `string` | no |
| `variant` | `'default' \| 'inline'` | no |
| `link` | `Link` | no |

```tsx
<ContentItem bg='bg-neutral-200' variant='default' image={{
    src: './sb-assets/engine.png',
  }} title='Engine' />
```

### ContentTile

**Import:** `import { ContentTile } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/content-tile`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `link` | `Link` | no |
| `image` | `Image` | no |
| `imageSizes` | `string` | no |

```tsx
<ContentTile title='Hybrid battery systems' link={{
    name: 'Read more',
  }} image={{
    src: '/sb-assets/car-front.png',
  }} />
```

### Costs

**Import:** `import { Costs } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/costs`

| Prop | Type | Required |
|------|------|----------|
| `subtotal` | `number` | yes |
| `discount` | `number` | yes |
| `tax` | `number` | yes |
| `shipping` | `number` | yes |
| `isShippingEstimated` | `boolean` | no |
| `total` | `number` | yes |
| `currency` | `'AED' \| 'AFN' \| 'ALL' \| 'AMD' \| 'ANG' \| 'AOA' \| 'ARS' \| 'AUD' \| 'AWG' \| 'AZN' \| 'BAM' \| 'BBD' \| 'BDT' \| 'BGN' \| 'BHD' \| 'BIF' \| 'BMD' \| 'BND' \| 'BOB' \| 'BRL' \| 'BSD' \| 'BTN' \| 'BWP' \| 'BYR' \| 'BZD' \| 'CAD' \| 'CDF' \| 'CHF' \| 'CLP' \| 'CNY' \| 'COP' \| 'CRC' \| 'CUC' \| 'CUP' \| 'CVE' \| 'CZK' \| 'DJF' \| 'DKK' \| 'DOP' \| 'DZD' \| 'EGP' \| 'ERN' \| 'ETB' \| 'EUR' \| 'FJD' \| 'FKP' \| 'GBP' \| 'GEL' \| 'GGP' \| 'GHS' \| 'GIP' \| 'GMD' \| 'GNF' \| 'GTQ' \| 'GYD' \| 'HKD' \| 'HNL' \| 'HRK' \| 'HTG' \| 'HUF' \| 'IDR' \| 'ILS' \| 'IMP' \| 'INR' \| 'IQD' \| 'IRR' \| 'ISK' \| 'JEP' \| 'JMD' \| 'JOD' \| 'JPY' \| 'KES' \| 'KGS' \| 'KHR' \| 'KMF' \| 'KPW' \| 'KRW' \| 'KWD' \| 'KYD' \| 'KZT' \| 'LAK' \| 'LBP' \| 'LKR' \| 'LRD' \| 'LSL' \| 'LYD' \| 'MAD' \| 'MDL' \| 'MGA' \| 'MKD' \| 'MMK' \| 'MNT' \| 'MOP' \| 'MRO' \| 'MUR' \| 'MVR' \| 'MWK' \| 'MXN' \| 'MYR' \| 'MZN' \| 'NAD' \| 'NGN' \| 'NIO' \| 'NOK' \| 'NPR' \| 'NZD' \| 'OMR' \| 'PAB' \| 'PEN' \| 'PGK' \| 'PHP' \| 'PKR' \| 'PLN' \| 'PYG' \| 'QAR' \| 'RON' \| 'RSD' \| 'RUB' \| 'RWF' \| 'SAR' \| 'SBD' \| 'SCR' \| 'SDG' \| 'SEK' \| 'SGD' \| 'SHP' \| 'SLL' \| 'SOS' \| 'SPL' \| 'SRD' \| 'STD' \| 'SVC' \| 'SYP' \| 'SZL' \| 'THB' \| 'TJS' \| 'TMT' \| 'TND' \| 'TOP' \| 'TRY' \| 'TTD' \| 'TVD' \| 'TWD' \| 'TZS' \| 'UAH' \| 'UGX' \| 'USD' \| 'UYU' \| 'UZS' \| 'VEF' \| 'VND' \| 'VUV' \| 'WST' \| 'XAF' \| 'XCD' \| 'XDR' \| 'XOF' \| 'XPF' \| 'YER' \| 'ZAR' \| 'ZMW' \| 'ZWD'` | yes |
| `loading` | `boolean` | no |
| `classNames` | `{ container?: string; totalAmount?: string; subCostsContainer?: string; subCosts?: string; }` | no |

### DatePicker

**Import:** `import { DatePicker } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/date-picker`

```tsx
<DatePicker />
```

### DatePickerInput

**Import:** `import { DatePickerInput } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/date-picker-input`

### DiscountsForm

**Import:** `import { DiscountsForm } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/discounts-form`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `discounts` | `Array<Discount & { onRemove?: () => Promise<boolean> }>` | yes |
| `onSubmit` | `(code: string) => Promise<boolean>` | no |
| `customError` | `string` | no |

### EmptyState

**Import:** `import { EmptyState } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/empty-state`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `header` | `string` | no |
| `image` | `React.ReactNode` | no |
| `isLoading` | `boolean` | no |

### InfoBanner

**Import:** `import { InfoBanner } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/info-banner`

| Prop | Type | Required |
|------|------|----------|
| `variant` | `'primary' \| 'warning'` | no |
| `className` | `string` | no |

```tsx
<InfoBanner>{(
    <>
      <b>View-Only</b> For full permissions, please contact your company administrator.
    </>
  )}</InfoBanner>
```

### MoveToList

**Import:** `import { MoveToList } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/move-to-list`

| Prop | Type | Required |
|------|------|----------|
| `lists` | `{ label: string; id: string }[]` | yes |
| `disabled` | `boolean` | no |
| `onSubmit` | `(selected: string[]) => Promise<void>` | no |
| `onAddNewList` | `(list: Pick<PurchaseList, 'name' \| 'description' \| 'store'>) => Promise<Wishlist \| null>` | no |

```tsx
<MoveToList />
```

### Popover

**Import:** `import { Popover } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/popover`

| Prop | Type | Required |
|------|------|----------|
| `isOpen` | `boolean` | yes |
| `onClose` | `() => void` | no |
| `direction` | `'left' \| 'right'` | yes |
| `buttonElement` | `() => React.JSX.Element` | yes |

### ProductAttributes

**Import:** `import { ProductAttributes } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/product-attributes`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `attributes` | `Attribute[]` | yes |

### ProductTile

**Import:** `import { ProductTile } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/product-tile`

| Prop | Type | Required |
|------|------|----------|
| `item` | `Product` | yes |
| `variant` | `'grid-item' \| 'list-item'` | no |
| `addToCartDisabled` | `boolean` | no |
| `onAddToCart` | `(qty: number) => Promise<void>` | no |
| `className` | `string` | no |

```tsx
<ProductTile variant='grid-item' />
```

### PurchaseListItem

**Import:** `import { PurchaseListItem } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/purchase-list-item`

| Prop | Type | Required |
|------|------|----------|
| `item` | `PurchaseListItem` | yes |
| `onRemove` | `() => Promise<boolean>` | no |
| `onAddToCart` | `() => Promise<boolean>` | no |
| `onQuantityChange` | `(qty: number) => Promise<boolean>` | no |

```tsx
<PurchaseListItem item={{ ...item, maxQuantity: 10 }} />
```

### SectionHeader

**Import:** `import { SectionHeader } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/section-header`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `link` | `Link` | no |

```tsx
<SectionHeader title='Product Categories' link={{
    name: 'All categories',
  }} />
```

### ShowMore

**Import:** `import { ShowMore } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/show-more`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `renderLabel` | `(props: { isShowingAll: boolean }) => React.ReactNode` | no |

```tsx
<ShowMore>{(
    <>
      <p>Part Number - 770035A</p>
      <p>Weight - 563 gram</p>
    </>
  )}</ShowMore>
```

### Timeline

**Import:** `import { Timeline } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/timeline`

| Prop | Type | Required |
|------|------|----------|
| `activeIndex` | `number` | no |
| `classNames` | `{ track?: string; trackActive?: string; bullet?: string; bulletActive?: string; }` | no |

```tsx
<Timeline activeIndex={0} classNames={{
    track: 'bg-gray-300',
    trackActive: 'bg-primary',
    bullet: 'bg-gray-300',
    bulletActive: 'bg-primary',
  }} />
```

### VerticalSlider

**Import:** `import { VerticalSlider } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/vertical-slider`

### WishlistModal

**Import:** `import { WishlistModal } from '@scaffold';`  
**Source:** `src/components/scaffold/molecules/wishlist-modal`

| Prop | Type | Required |
|------|------|----------|
| `lists` | `Array<Wishlist>` | yes |
| `isOpen` | `boolean` | yes |
| `onSubmit` | `(lists: Array<Wishlist>) => void` | yes |
| `selectedIds` | `string[]` | yes |
| `handleChange` | `(id: string, checked: boolean) => void` | yes |
| `loading` | `boolean` | no |
| `onClose` | `() => void` | yes |
| `onAddToNewList` | `( list: Pick<PurchaseList, 'name' \| 'description' \| 'store'>, count?: number, sku?: string, ) => Promise<SharedWishlist \| null>` | no |

## Organisms

### AnnouncementBar

**Import:** `import { AnnouncementBar } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/announcement-bar`

| Prop | Type | Required |
|------|------|----------|
| `accountLinks` | `NavigationCategory[]` | yes |
| `textBar` | `string` | yes |
| `selectedBusinessUnit` | `string` | no |
| `businessUnitIsLoading` | `boolean` | no |
| `businessUnits` | `Option[]` | yes |
| `selectedStore` | `string` | no |
| `stores` | `Option[]` | yes |
| `name` | `string` | yes |
| `quotes` | `number` | yes |
| `onLogoutClick` | `() => void` | yes |
| `onBusinessUnitChange` | `(businessUnit: string) => void` | no |
| `onStoreChange` | `(store: string) => void` | no |

```tsx
<AnnouncementBar name='Erika' onLogoutClick={() => {}} textBar='Worldwide shipping & returns *' quotes={4} businessUnits={[
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ]} stores={[
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ]} accountLinks={[{ categoryId, name, path, paths, descendants }, /* ...6 more */]} />
```

### AuthForm

**Import:** `import { AuthForm } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`

| Prop | Type | Required |
|------|------|----------|
| `includeCheckIcon` | `boolean` | no |
| `error` | `string` | no |
| `title` | `string` | yes |
| `subtitle` | `string` | no |
| `subtitleLink` | `string` | no |
| `subtitleLinkLabel` | `string` | no |
| `buttonLabel` | `string` | yes |
| `footerLabel` | `string` | no |
| `footerLink` | `string` | no |
| `footerOnClick` | `() => void` | no |
| `footerLinkLabel` | `string` | no |
| `onSubmit` | `() => void` | yes |

### AuthLayout

**Import:** `import { AuthLayout } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`

| Prop | Type | Required |
|------|------|----------|
| `image` | `ImageProps` | yes |
| `logo` | `Image` | yes |
| `logoLink` | `Link` | yes |

### Cart

**Import:** `import { Cart } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/cart`

| Prop | Type | Required |
|------|------|----------|
| `loading` | `boolean` | no |
| `lineItems` | `ProductWithDeleteAttr[]` | yes |
| `account` | `Pick<Account, 'email'>` | yes |
| `paymentMethods` | `Array<PaymentMethod>` | yes |
| `viewCartDisabled` | `boolean` | no |
| `quoteRequestDisabled` | `boolean` | no |
| `checkoutDisabled` | `boolean` | no |
| `invalidAddressesRequirements` | `boolean` | no |
| `discountCodes` | `Array<Discount & { onRemove?: () => Promise<boolean> }>` | yes |
| `onAdd` | `(sku: string, qty: number) => Promise<void>` | yes |
| `onRemove` | `(id: string) => Promise<void>` | yes |
| `onUpdateQuantity` | `(id: string, qty: number) => Promise<void>` | yes |
| `onDiscountRedeem` | `(code: string) => Promise<boolean>` | no |
| `onClear` | `() => Promise<void>` | no |
| `transaction` | `Transaction` | no |
| `onAddToNewWishlist` | `( list: Pick<PurchaseList, 'name' \| 'description' \| 'store'>, sku?: string, qty?: number, ) => Promise<Wishlist \| null>` | yes |

```tsx
<Cart />
```

### Checkout

**Import:** `import { Checkout } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/checkout`

| Prop | Type | Required |
|------|------|----------|
| `buyerCanAddComment` | `boolean` | no |
| `enableCtCheckout` | `boolean` | no |
| `addresses` | `Address[]` | yes |
| `onAddAddress` | `(address: Address) => Promise<boolean>` | no |
| `products` | `Array<Pick<Product, 'id' \| 'name' \| 'currency' \| 'price' \| 'quantity' \| 'images' \| 'url'>>` | yes |
| `transaction` | `Transaction` | yes |
| `discounts` | `Array<Discount & { onRemove?: () => Promise<boolean> }>` | yes |
| `onApplyDiscount` | `(code: string) => Promise<boolean>` | no |
| `countryOptions` | `Array<Option & { states: Array<Option> }>` | yes |
| `onCompleteAddresses` | `(shippingAddress: Address, billingAddress: Address) => Promise<boolean>` | no |
| `termsAndConditionsLink` | `Link` | no |
| `initialData` | `InitialData` | yes |
| `shippingMethods` | `ShippingMethod[]` | yes |
| `onCompleteShipping` | `(shippingMethodId: string) => Promise<boolean>` | no |
| `paymentMethods` | `PaymentMethod[]` | yes |
| `onCompletePayment` | `(paymentMethodId: string, data: unknown) => Promise<boolean>` | no |
| `onSubmitPurchase` | `(paylaod: SubmitPurchasePayload) => Promise<boolean>` | yes |
| `translations` | `{ header?: string; orderSummaryTitle?: string; orderSummarySubtitle?: string; purchase?: string; review?: string; }` | no |

```tsx
<Checkout />
```

### Confirmation

**Import:** `import { Confirmation } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/confirmation`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `translations` | `{ title?: string; summary?: string; confirm?: string; cancel?: string; }` | yes |
| `isOpen` | `boolean` | no |
| `disabled` | `boolean` | no |
| `onConfirm` | `() => Promise<void>` | no |
| `onCancel` | `() => void` | no |

```tsx
<Confirmation translations={{
    title: 'Delete Address',
    summary: 'Are you sure you want to permanently delete this address?',
    cancel: 'Cancel',
    confirm: 'Delete',
  }} />
```

### ContentItems

**Import:** `import { ContentItems } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/content-items`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `link` | `Link` | yes |
| `items` | `Item[]` | yes |
| `variant` | `'default' \| 'inline'` | no |

```tsx
<ContentItems variant='default' title='Product Categories' link={{
    name: 'All categories',
  }} items={[{ title, image }, /* ...7 more */]} />
```

### ContentSlider

**Import:** `import { ContentSlider } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/content-slider`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `link` | `Link` | no |
| `items` | `Item[]` | yes |

```tsx
<ContentSlider title='Explore latest Trends in Auto Manufacturing' link={{
    name: 'All articles',
  }} items={[
    { title: 'Circular car seneors', link: { name: 'Read more' }, image: { src: '/sb-assets/car-sensor.png' } },
    { title: 'Hybrid batter systems', link: { name: 'Read more' }, image: { src: '/sb-assets/car-front.png' } },
    { title: 'Automotive trends in 2023', link: { name: 'Read more' }, image: { src: '/sb-assets/cars-trends.png' } },
    { title: 'Fuel-Efficient cruiser', link: { name: 'Read more' }, image: { src: '/sb-assets/car.png' } },
  ]} />
```

### ContentTiles

**Import:** `import { ContentTiles } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/content-tiles`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `link` | `Link` | no |
| `items` | `Item[]` | yes |

```tsx
<ContentTiles title='Explore latest Trends in Auto Manufacturing' link={{
    name: 'All articles',
  }} items={[
    { title: 'Circular car seneors', link: { name: 'Read more' }, image: { src: '/sb-assets/car-sensor.png' } },
    { title: 'Hybrid batter systems', link: { name: 'Read more' }, image: { src: '/sb-assets/car-front.png' } },
    { title: 'Automotive trends in 2023', link: { name: 'Read more' }, image: { src: '/sb-assets/cars-trends.png' } },
  ]} />
```

### Drawer

**Import:** `import { Drawer } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/drawer`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `headerClassName` | `string` | no |
| `headline` | `string` | yes |
| `isOpen` | `boolean` | yes |
| `overlay` | `boolean` | no |
| `direction` | `'left' \| 'right'` | yes |
| `blockScrolling` | `boolean` | no |
| `onClose` | `() => void` | no |

### EntityForm

**Import:** `import { EntityForm } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/entity-form`

| Prop | Type | Required |
|------|------|----------|
| `translations` | `{ submit?: string; cancel?: string; }` | yes |
| `unstyled` | `boolean` | no |
| `classNames` | `{ form?: string; buttonsContainer?: string; }` | no |
| `showCancelButton` | `boolean` | no |
| `showSubmitButton` | `boolean` | no |
| `onCancel` | `() => void` | no |
| `onSubmit` | `() => Promise<void>` | no |

```tsx
<EntityForm translations={{
    cancel: 'Cancel',
    submit: 'Save',
  }}>{(
    <div className="flex flex-col gap-4">
      <Input className="w-[400px]" label="Name" defaultValue="commercetools" />
      <Input className="w-[400px]" label="Email" defaultValue="123@commercetools.com" />
      <Input className="w-[400px]" label="Country" showOptionalLabel />
      <Input className="w-[400px]" label="VAT Number" showOptionalLabel />
    </div>
  )}</EntityForm>
```

### Footer

**Import:** `import { Footer } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/footer`

| Prop | Type | Required |
|------|------|----------|
| `links` | `Link[]` | no |
| `copyrightStatement` | `string` | no |
| `variant` | `'default' \| 'simple'` | no |

```tsx
<Footer variant='default' links={[
    { name: 'Orders & returns', href: '#' },
    { name: 'Help & contact', href: '#' },
    { name: 'Terms & conditions', href: '#' },
    { name: 'FAQ', href: '#' },
  ]} copyrightStatement='© Powered by commercetools' />
```

### Gallery

**Import:** `import { Gallery } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/gallery`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `images` | `string[]` | yes |

### Header

**Import:** `import { Header } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/header`

| Prop | Type | Required |
|------|------|----------|
| `variant` | `'account' \| 'navigation' \| 'checkout'` | yes |
| `isAdmin` | `boolean` | yes |
| `myAccountMenu` | `NavigationCategory` | yes |
| `cartItems` | `number` | yes |
| `cartLink` | `Link` | yes |
| `accountLink` | `Link` | yes |
| `pageLinks` | `Link[]` | yes |
| `categoryLinks` | `NavigationCategory[]` | yes |
| `logo` | `LogoImage` | yes |
| `logoLink` | `Link` | yes |
| `selectedBusinessUnit` | `string` | no |
| `businessUnits` | `Option[]` | yes |
| `selectedStore` | `string` | no |
| `stores` | `Option[]` | yes |
| `searchSuggestions` | `ProductSuggestion[]` | yes |
| `quickOrderProducts` | `ProductSuggestion[]` | yes |
| `searchPlaceholder` | `string` | yes |
| `quotes` | `number` | yes |
| `csvDownloadLink` | `string` | yes |
| `quickOrderSearch` | `string` | yes |
| `headerSearch` | `string` | yes |
| `csvShowProducts` | `CsvProduct[]` | yes |
| `csvShowProductsLoading` | `boolean` | yes |
| `addToCartDisabled` | `boolean` | no |
| `onBusinessUnitChange` | `(businessUnit: string) => void` | no |
| `onStoreChange` | `(store: string) => void` | no |
| `onQuickOrderSearch` | `(value: string) => void` | no |
| `onHeaderSearch` | `(value: string) => void` | no |
| `onHeaderSearchAction` | `() => void` | no |
| `handleSKUsUpdate` | `(skus: string[]) => void` | no |
| `addToCart` | `( lineItems: { sku: string; count: number; }[], ) => Promise<object>` | no |

```tsx
<Header variant='navigation' pageLinks={[
    resolveReference({ type: 'link', link: '/' }, 'Member + Benefits'),
    resolveReference({ type: 'link', link: '/' }, 'Sale'),
    resolveReference({ type: 'link', link: '/' }, 'New items'),
  ]} myAccountMenu={{ categoryId, name, path, paths, descendants }} categoryLinks={[{ categoryId, name, link, paths, descendants }, /* ...2 more */]} logo={{ src: '/logo.svg', width: 120, height: 32 }} logoLink={resolveReference({ type: 'link', link: '/' }, 'Logo')} accountLink={resolveReference({ type: 'link', link: '/' }, 'Logo')} cartItems={23} cartLink={resolveReference({ type: 'link', link: '/' }, 'Logo')} businessUnits={[
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ]} stores={[
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ]} quotes={4} searchPlaceholder='Search by SKU number, product name or keyword' searchSuggestions={productListImage} quickOrderProducts={[{ id, sku, name, maxQuantity, image, url }, /* ...7 more */]} csvDownloadLink='/template.csv' />
```

### HeroTile

**Import:** `import { HeroTile } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/hero-tile`

| Prop | Type | Required |
|------|------|----------|
| `image` | `Image` | no |
| `title` | `string` | no |
| `links` | `Link[]` | no |
| `isPriority` | `boolean` | no |
| `imageQuality` | `number` | yes |

```tsx
<HeroTile image={{
    media: {
      mediaId: image.mediaId,
      resourceType: 'image',
      name: image.name,
      tags: [],
      file: image.url,
      size: 516362,
      width: 1378,
      height: 1378,
    },
    ratio: '16:9',
  }} title='Hello, Erika!' links={[
    { name: 'Quotes', href: '#' },
    { name: 'Orders', href: '#' },
    { name: 'Company Admin', href: '#' },
  ]} imageQuality={75} />
```

### Login

**Import:** `import { Login } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`

| Prop | Type | Required |
|------|------|----------|
| `image` | `ImageProps` | yes |
| `logo` | `Image` | yes |
| `logoLink` | `Link` | yes |
| `login` | `UseAccountReturn['login']` | yes |
| `requestPasswordReset` | `UseAccountReturn['requestPasswordReset']` | yes |

### Modal

**Import:** `import { Modal } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/modal`
**Inherits:** `ReactModalProps`

| Prop | Type | Required |
|------|------|----------|
| `closeButton` | `boolean` | no |
| `size` | `'fit' \| 'sm' \| 'md' \| 'lg'` | no |
| `centered` | `boolean` | no |
| `variant` | `'default' \| 'sticky-bottom'` | no |

```tsx
<Modal size='sm' />
```

### OrderItemsListing

**Import:** `import { OrderItemsListing } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/order-items-listing`

| Prop | Type | Required |
|------|------|----------|
| `className` | `string` | no |
| `lineItems` | `LineItem[]` | yes |

### OrderPaymentSection

**Import:** `import { OrderPaymentSection } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/order-payment-section`

### OrderSummary

**Import:** `import { OrderSummary } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/order-summary`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `className` | `string` | no |
| `classNames` | `ClassNames` | no |
| `cart` | `Cart` | no |
| `order` | `Order` | no |
| `includeItemsList` | `boolean` | no |
| `includeSummaryAccordion` | `boolean` | no |
| `paymentMethods` | `Array<PaymentMethod>` | no |
| `dataReference` | `'order' \| 'cart'` | no |
| `button` | `ReactElement<unknown>` | no |
| `transaction` | `Transaction` | no |
| `discounts` | `Array<Discount & { onRemove?: () => Promise<boolean> }>` | no |
| `onDiscountRedeem` | `(code: string) => Promise<boolean>` | no |

### ProductDetails

**Import:** `import { ProductDetails } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/product-details`

| Prop | Type | Required |
|------|------|----------|
| `description` | `string` | no |
| `specifications` | `Array<Attribute>` | no |
| `product` | `Product` | yes |
| `addToCartDisabled` | `boolean` | no |
| `addToCart` | `(count: number) => Promise<void>` | yes |
| `shippingMethods` | `ShippingMethod[]` | yes |
| `currentColor` | `Attribute` | yes |
| `currentSpecs` | `Attribute` | yes |
| `getWishlists` | `() => Promise<Array<Wishlist> \| undefined>` | yes |
| `addToWishlists` | `(wishlistIds: string[], count?: number) => Promise<Wishlist[]>` | yes |
| `removeFromWishlists` | `(wishlists: { wishlistId: string; lineItemId: string }[]) => Promise<Wishlist[]>` | yes |
| `addToNewWishlist` | `( list: Pick<SharedWishlist, 'name' \| 'description' \| 'store'>, count?: number, ) => Promise<SharedWishlist \| null>` | yes |
| `onChangeVariant` | `(variant: 'color' \| 'model', value: string) => void` | yes |

```tsx
<ProductDetails product={{
    ...commonProductProps,
    colors: [
      { label: 'Light Blue', value: 'lightblue' },
      { label: 'Saddle Brown', value: 'saddlebrown' },
    ],
  }} currentColor={{ label: 'Light Blue', value: 'lightblue' }} />
```

### ProductList

**Import:** `import { ProductList } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/product-list`

| Prop | Type | Required |
|------|------|----------|
| `products` | `Product[]` | yes |
| `facets` | `Facet[]` | yes |
| `searchQuery` | `string` | no |
| `breadcrumb` | `Array<CategoryBreadcrumb>` | yes |
| `onRefine` | `(facet: Facet[]) => void` | yes |
| `onResetAll` | `() => void` | yes |
| `currentSortValue` | `string` | yes |
| `currentSortVector` | `string` | yes |
| `sortValues` | `(Option & { vector: 'asc' \| 'desc' })[]` | yes |
| `onSortValueChange` | `(sortValue: string, vector: 'asc' \| 'desc') => void` | yes |
| `title` | `string` | yes |
| `limit` | `number` | yes |
| `total` | `number` | yes |
| `onLoadMore` | `() => void` | yes |
| `addToCartDisabled` | `boolean` | no |
| `onAddToCart` | `(sku: string, qty: number) => Promise<void>` | yes |

```tsx
<ProductList products={Array.from({ length: 20 }, (_, index) => ({
    id…} title='Brake System' breadcrumb={[
    { name: 'Home', link: '#' },
    { name: 'Brake Systems', link: '#' },
  ]} limit={30} total={145} sortValues={[
    { name: 'Featured', value: 'featured', vector: 'asc' },
    { name: 'Price', value: 'price', vector: 'asc' },
    { name: 'Best-Selling', value: 'best-selling', vector: 'asc' },
    { name: 'Newest', value: 'newest', vector: 'asc' },
  ]} currentSortValue='featured' facets={[{ id, name, type, selected, values, maxVisibleItems }, /* ...3 more */]} />
```

### ProductSlider

**Import:** `import { ProductSlider } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/product-slider`

| Prop | Type | Required |
|------|------|----------|
| `headline` | `string` | no |
| `products` | `Product[]` | yes |
| `addToCartDisabled` | `boolean` | no |
| `onAddToCart` | `(sku: string) => Promise<void>` | no |

```tsx
<ProductSlider headline='Similiar products' products={sliderItems} />
```

### QuickOrderAccordion

**Import:** `import { QuickOrderAccordion } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/quick-order`

```tsx
<QuickOrderAccordion items={items} downloadLink='/template.csv' />
```

### QuickOrderDesktop

**Import:** `import { QuickOrderDesktop } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/quick-order`
**Inherits:** `QuickOrderProps`

| Prop | Type | Required |
|------|------|----------|
| `downloadLink` | `string` | yes |
| `handleSKUsUpdate` | `(skus: string[]) => void` | no |

```tsx
<QuickOrderDesktop items={items} downloadLink='/template.csv' />
```

### QuoteThankYou

**Import:** `import { QuoteThankYou } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/quote-thank-you`

| Prop | Type | Required |
|------|------|----------|
| `account` | `{ email: string }` | yes |
| `quoteRequestId` | `string` | no |
| `deliveryMethod` | `string` | no |
| `deliveryAddress` | `Address` | no |
| `paymentMethod` | `string` | no |
| `billingAddress` | `Address` | no |
| `comment` | `string` | no |
| `onReviewQuoteClick` | `() => void` | no |
| `lineItems` | `Product[]` | yes |
| `transaction` | `Transaction` | yes |
| `purchaseOrderNumber` | `string` | no |

```tsx
<QuoteThankYou account={{
    email: 'madilyn@gmail.com',
  }} quoteRequestId='1155 2224 4452' deliveryMethod='2023-01-15 with UPS' deliveryAddress={{
    id: '1',
    name: 'commercetools1',
    careOf: 'Madilyn Newman',
    line1: 'Fiolvägen 33',
    zip: '433 22',
    city: 'Stockholm',
    country: 'Sweden',
  }} paymentMethod='Purchase Order ***' billingAddress={{
    id: '1',
    name: 'commercetools1',
    careOf: 'Madilyn Newman',
    line1: 'Fiolvägen 33',
    zip: '433 22',
    city: 'Stockholm',
    country: 'Sweden',
  }} comment='Can I have a 10% discount on Bd10T789?' lineItems={[
    {
      id: '1',
      name: 'Brake Pad Set, disc brake DELPHI L20',
      price: 115.99,
      currency: 'USD',
      quantity: 4,
      images: ['/brake-pad.png'],
    },
    {
      id: '2',
      name: 'Brake Pad Set, disc brake DELPHI L20',
      price: 115.99,
      currency: 'USD',
      quantity: 3,
      images: ['/brake-pad.png'],
    },
  ]} transaction={{
    subtotal: 266.99,
    shipping: 23.99,
    taxes: 4.99,
    total: 299.99,
    discounts: 0,
    currency: 'USD',
  }} />
```

### Register

**Import:** `import { Register } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`

| Prop | Type | Required |
|------|------|----------|
| `image` | `ImageProps` | yes |
| `logo` | `Image` | yes |
| `logoLink` | `Link` | yes |
| `register` | `UseAccountReturn['register']` | yes |

### ResetPassword

**Import:** `import { ResetPassword } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`

| Prop | Type | Required |
|------|------|----------|
| `image` | `ImageProps` | yes |
| `logo` | `Image` | yes |
| `logoLink` | `Link` | yes |
| `resetPassword` | `UseAccountReturn['resetPassword']` | yes |

### ResponsiveModal

**Import:** `import { ResponsiveModal } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/responsive-modal`

### RuleBuilder

**Import:** `import { RuleBuilder } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/rule-builder`

| Prop | Type | Required |
|------|------|----------|
| `group` | `Group` | no |
| `maxDepth` | `number` | no |
| `translations` | `Translations` | no |
| `singleMode` | `boolean` | no |
| `includeGroupHeader` | `boolean` | no |
| `includeRemoveButton` | `boolean` | no |
| `onRemoveGroup` | `() => void` | no |
| `isPreview` | `boolean` | no |
| `criteria` | `Criteria[]` | yes |
| `onRuleUpdate` | `(rule: Group) => void` | no |
| `onReset` | `() => void` | no |
| `allowedCombinators` | `GroupProps['allowedCombinators']` | no |
| `showCombinators` | `GroupProps['showCombinators']` | no |

```tsx
<RuleBuilder isPreview={false} criteria={[
    {
      key: 'totalPrice.centAmount',
      name: 'Cart amount',
      type: 'text',
      operators: [
        { name: 'Is equal', value: '=' },
        { name: 'Is more than', value: '>' },
        { name: 'Is less than', value: '<' },
      ],
    },
    {
      key: 'currency',
      name: 'Cart currency',
      type: 'enum',
      operators: [
        { name: 'Is', value: 'is' },
        { name: 'Is not', value: 'is not' },
      ],
      values: [
        { name: 'USD', value: 'usd' },
        { name: 'EUR', value: 'eur' },
      ],
    },
  ]} />
```

### Search

**Import:** `import { Search } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/search`

| Prop | Type | Required |
|------|------|----------|
| `ref` | `React.ForwardedRef<HTMLInputElement \| null>` | no |
| `scrollControl` | `boolean` | yes |
| `variant` | `'xs' \| 'sm' \| 'lg'` | yes |
| `disabled` | `boolean` | no |
| `searchValue` | `string` | no |
| `handleOnChange` | `(value: string) => void` | no |
| `searchResult` | `ProductSuggestion[]` | no |
| `filterSearch` | `boolean` | yes |
| `placeholder` | `string` | yes |
| `suggestions` | `ProductSuggestion[]` | no |
| `onProductClick` | `(product: ProductSuggestion) => void` | no |
| `handleSearchAction` | `() => void` | no |

```tsx
<Search filterSearch={true} variant='xs' suggestions={productList} placeholder='Search...' />
```

### ShippingAndLanguage

**Import:** `import { ShippingAndLanguage } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/shipping-and-language`

```tsx
<ShippingAndLanguage desktopDirection='left' />
```

### Sidebar

**Import:** `import { Sidebar } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/sidebar`

| Prop | Type | Required |
|------|------|----------|
| `title` | `string` | no |
| `links` | `Array<Link & { isActive?: boolean }>` | no |

```tsx
<Sidebar title='HELLO, ERIKA!' links={[
    { name: 'Dashboard', href: '#', isActive: true },
    { name: 'Orders', href: '#' },
    { name: 'Quotes', href: '#' },
    { name: 'Company Admin', href: '#' },
    { name: 'Purchase Lists', href: '#' },
    { name: 'Settings & Security', href: '#' },
    { name: 'Addresses', href: '#' },
  ]} />
```

### Slider

**Import:** `import { Slider } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/slider`
**Inherits:** `Omit<React.ComponentProps<typeof Slick>, 'slidesToShow'>`

| Prop | Type | Required |
|------|------|----------|
| `ref` | `React.ForwardedRef<Slick \| null>` | no |
| `spaceBetween` | `number \| ResponsiveQuery<number>` | no |
| `arrowSize` | `number` | no |
| `arrowStyles` | `React.CSSProperties` | no |
| `arrowClassName` | `string` | no |
| `arrowIconClassName` | `string` | no |
| `arrowVariant` | `ArrowProps['variant']` | no |
| `overlayDarkArrow` | `boolean` | no |
| `slideWidth` | `number \| ResponsiveQuery<number>` | no |
| `slidesToShow` | `number \| ResponsiveQuery<number>` | no |
| `containerClassName` | `string` | no |

```tsx
<Slider slidesToShow={3.2} slidesToScroll={1} arrows={true} arrowSize={32} infinite={false}>{slideElements}</Slider>
```

### Table

**Import:** `import { Table } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/table`

```tsx
<Table />
```

### Tabs

**Import:** `import { Tabs } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/tabs`

```tsx
<Tabs>{(
    <>
      <Tabs.TabList>
        <Tabs.Tab>Tab 1</Tabs.Tab>
        <Tabs.Tab>Tab 2</Tabs.Tab>
        <Tabs.Tab>Tab 3</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>Panel 1</Tabs.Panel>
        <Tabs.Panel>Panel 2</Tabs.Panel>
        <Tabs.Panel>Panel 3</Tabs.Panel>
      </Tabs.Panels>
    </>
  )}</Tabs>
```

### ThankYou

**Import:** `import { ThankYou } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/thank-you`

| Prop | Type | Required |
|------|------|----------|
| `account` | `{ email: string }` | yes |
| `orderId` | `string` | no |
| `orderNumber` | `string` | no |
| `deliveryMethod` | `string` | no |
| `deliveryAddress` | `Address` | no |
| `paymentMethod` | `string` | no |
| `billingAddress` | `Address` | no |
| `onReviewOrderClick` | `() => void` | no |
| `lineItems` | `Product[]` | yes |
| `transaction` | `Transaction` | yes |
| `purchaseOrderNumber` | `string` | no |

```tsx
<ThankYou account={{
    email: 'madilyn@gmail.com',
  }} orderNumber='1155 2224 4452' deliveryMethod='2023-01-15 with UPS' deliveryAddress={{
    id: '1',
    name: 'commercetools1',
    careOf: 'Madilyn Newman',
    line1: 'Fiolvägen 33',
    zip: '433 22',
    city: 'Stockholm',
    country: 'Sweden',
  }} paymentMethod='Purchase Order ***' billingAddress={{
    id: '1',
    name: 'commercetools1',
    careOf: 'Madilyn Newman',
    line1: 'Fiolvägen 33',
    zip: '433 22',
    city: 'Stockholm',
    country: 'Sweden',
  }} lineItems={[
    {
      id: '1',
      name: 'Brake Pad Set, disc brake DELPHI L20',
      price: 115.99,
      currency: 'USD',
      quantity: 4,
      images: ['/brake-pad.png'],
    },
    {
      id: '2',
      name: 'Brake Pad Set, disc brake DELPHI L20',
      price: 115.99,
      currency: 'USD',
      quantity: 3,
      images: ['/brake-pad.png'],
    },
  ]} transaction={{
    subtotal: 266.99,
    shipping: 23.99,
    taxes: 4.99,
    total: 299.99,
    discounts: 0,
    currency: 'USD',
  }} />
```

### VerifyAssociate

**Import:** `import { VerifyAssociate } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`

| Prop | Type | Required |
|------|------|----------|
| `image` | `ImageProps` | yes |
| `logo` | `Image` | yes |
| `logoLink` | `Link` | yes |
| `company` | `string` | yes |
| `onSubmit` | `onSubmitVerifyAssociate` | yes |

### VerifyFailed

**Import:** `import { VerifyFailed } from '@scaffold';`  
**Source:** `src/components/scaffold/organisms/authentication`
