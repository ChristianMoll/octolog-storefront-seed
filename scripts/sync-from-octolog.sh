#!/usr/bin/env bash
# Sync vendored scaffold + AGENTS.md + scaffold-manifest.json from the
# octolog-prototypes monorepo. Run from any cwd.
#
# Configure source location with OCTOLOG_ROOT (defaults to ../octolog-prototypes).
set -euo pipefail

SEED_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OCTOLOG_ROOT="${OCTOLOG_ROOT:-$(cd "$SEED_ROOT/../octolog-prototypes" && pwd)}"
LAUNCHPAD_SRC="$OCTOLOG_ROOT/packages/launchpad/src"
MANIFEST_DIR="$OCTOLOG_ROOT/packages/launchpad/dist/manifest"

if [[ ! -d "$LAUNCHPAD_SRC" ]]; then
  echo "Could not find launchpad src at $LAUNCHPAD_SRC" >&2
  echo "Set OCTOLOG_ROOT to the octolog-prototypes checkout." >&2
  exit 1
fi

echo "[sync] Regenerating manifest in $OCTOLOG_ROOT"
( cd "$OCTOLOG_ROOT" && pnpm --filter @octolog/launchpad build:manifest )

echo "[sync] Replacing vendor/scaffold/"
rm -rf "$SEED_ROOT/vendor/scaffold"
mkdir -p "$SEED_ROOT/vendor/scaffold"

# Copy only the directories the scaffold transitively needs.
# Skip the launchpad-specific grammar/registry layer (PageHeader.tsx, etc.),
# the SDK, project config, tests, stories, and snapshots.
SUBDIRS=(
  components/scaffold
  adapters
  hooks
  providers
  types
  utils
  constants
  lib
  static
)
for sub in "${SUBDIRS[@]}"; do
  if [[ -d "$LAUNCHPAD_SRC/$sub" ]]; then
    mkdir -p "$SEED_ROOT/vendor/scaffold/$sub"
    rsync -a \
      --exclude='*.spec.ts' --exclude='*.spec.tsx' \
      --exclude='*.test.ts' --exclude='*.test.tsx' \
      --exclude='*.stories.ts' --exclude='*.stories.tsx' \
      --exclude='__snapshots__' \
      "$LAUNCHPAD_SRC/$sub/" "$SEED_ROOT/vendor/scaffold/$sub/"
  fi
done

# Copy individual files referenced by the scaffold subtree.
cp "$LAUNCHPAD_SRC/styles.css" "$SEED_ROOT/vendor/scaffold/styles.css"
cp "$LAUNCHPAD_SRC/project.config.ts" "$SEED_ROOT/vendor/scaffold/project.config.ts"

echo "[sync] Updating AGENTS.md and scaffold-manifest.json"
"$SEED_ROOT/scripts/render-agents-md.sh" "$MANIFEST_DIR/scaffold-catalog.md" > "$SEED_ROOT/AGENTS.md"
cp "$MANIFEST_DIR/scaffold-manifest.json" "$SEED_ROOT/scaffold-manifest.json"

echo "[sync] Done."
