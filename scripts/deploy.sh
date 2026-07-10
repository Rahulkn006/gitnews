#!/bin/bash
set -e

echo "🚀 GitNews Production Deploy & Recovery"
echo "========================================"

cd "$(dirname "$0")/.." || exit 1

echo ""
echo "1. Installing dependencies..."
bun install

echo ""
echo "2. Deploying Convex backend..."
cd packages/backend
npx convex deploy

echo ""
echo "3. Seeding sample repositories (no API keys required)..."
npx convex run github:seedSampleRepositories

echo ""
echo "4. Seeding news dispatches..."
npx convex run news:seedNews

echo ""
echo "5. Scheduling real GitHub + AI sync (requires TOGETHER_API_KEY)..."
npx convex run github:scheduleGitHubSync

cd ../..

echo ""
echo "6. Building Astro frontend..."
cd apps/astro-web
bun run build

echo ""
echo "✅ Build complete. If you are using Cloudflare Pages, push this build output to your deployment branch."
