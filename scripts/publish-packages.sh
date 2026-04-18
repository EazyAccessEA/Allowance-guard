#!/usr/bin/env bash
#
# scripts/publish-packages.sh — ship @allowance-guard/client and
# @allowance-guard/react to the public npm registry.
#
# Assumes: you are authenticated (npm whoami returns your handle).
#          If not: run `npm login` first (or set NPM_TOKEN for CI).
#
# Order matters: client must publish before react because react
# peers-on it. pnpm substitutes the "workspace:*" protocol with the
# actual published version at pack time, so no manual edits needed.
#
# Provenance: each package's publishConfig requests provenance: true,
# which needs an OIDC-capable environment (e.g. GitHub Actions). For
# a local publish run pass --no-provenance. For CI, leave it on.
#
# Usage (local):
#   ./scripts/publish-packages.sh --no-provenance
#
# Usage (GitHub Actions with id-token: write permission):
#   ./scripts/publish-packages.sh

set -euo pipefail

EXTRA_FLAGS="${*:-}"

echo "== preflight =="
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required but not on PATH" >&2
  exit 1
fi
npm whoami >/dev/null 2>&1 || {
  echo "npm: not logged in. Run 'npm login' first, or set NPM_TOKEN." >&2
  exit 1
}
echo "  pnpm: $(pnpm --version)"
echo "  npm user: $(npm whoami)"

echo
echo "== build =="
pnpm -F @allowance-guard/client build
pnpm -F @allowance-guard/react build

echo
echo "== dry run =="
( cd packages/client && pnpm publish --dry-run $EXTRA_FLAGS ) || exit 1
( cd packages/react  && pnpm publish --dry-run $EXTRA_FLAGS ) || exit 1

read -r -p "Dry runs succeeded. Publish both for real? [y/N] " reply
case "$reply" in
  y|Y) ;;
  *) echo "Aborted."; exit 0 ;;
esac

echo
echo "== publish @allowance-guard/client =="
( cd packages/client && pnpm publish --access public $EXTRA_FLAGS )

echo
echo "== publish @allowance-guard/react =="
( cd packages/react && pnpm publish --access public $EXTRA_FLAGS )

echo
echo "Done."
echo "Verify: https://www.npmjs.com/package/@allowance-guard/client"
echo "        https://www.npmjs.com/package/@allowance-guard/react"
