# octolog-storefront-seed

Starting workspace cloned by Netlify Agent Runner for AI-generated storefronts.

The `@scaffold` package (vendored at `vendor/scaffold/`) holds the full
scaffold-b2b component library. The agent reads `AGENTS.md` for the catalog and
composes pages under `app/`.

## Local dev

```sh
npm ci
npm run dev
```

## Updating from octolog-prototypes

Re-runs the manifest extractor in the source monorepo and refreshes the vendor
copy + `AGENTS.md` + `scaffold-manifest.json`:

```sh
./scripts/sync-from-octolog.sh
```

By default, expects `octolog-prototypes` as a sibling directory; override with
`OCTOLOG_ROOT=/path/to/octolog-prototypes ./scripts/sync-from-octolog.sh`.
