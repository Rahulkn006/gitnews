#!/bin/bash
set -e

echo "🚀 GitNews Deployment Recovery Script"
echo "======================================"

cd "$(dirname "$0")/../packages/backend" || exit 1

echo ""
echo "1. Seeding sample repositories (no API keys required)..."
npx convex run github:seedSampleRepositories

echo ""
echo "2. Seeding news dispatches..."
npx convex run news:seedNews

echo ""
echo "3. Scheduling real GitHub + AI sync (requires TOGETHER_API_KEY)..."
npx convex run github:scheduleGitHubSync

echo ""
echo "✅ Done. Check the Convex dashboard for logs and the deployed site for content."
