#!/usr/bin/env bash
set -euo pipefail

echo "==> Resetting dependencies and lockfile..."

# Safety check: must be run from a folder that has package.json
if [ ! -f "package.json" ]; then
  echo "ERROR: package.json not found. Run this script from your project root."
  exit 1
fi

echo "==> Removing node_modules and package-lock.json (if present)..."
rm -rf node_modules
rm -f package-lock.json

echo "==> Installing fresh dependencies..."
npm install

echo "==> Verifying Next + TypeScript type packages are installed..."
node -e "require('next/package.json'); console.log('OK: next installed')"
node -e "require('@types/react'); console.log('OK: @types/react installed')"
node -e "require('@types/node'); console.log('OK: @types/node installed')"

echo "==> Running local build checks..."
npm run build

echo "==> Done. Commit package.json and package-lock.json and push."
