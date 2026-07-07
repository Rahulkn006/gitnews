export const WHY_TRENDING_DATA = [
  {
    id: "wt-1",
    name: "sindresorhus/awesome",
    headline: "Why developers are watching:",
    reasons: [
      "35k+ new stars this month",
      "Used by thousands of learning resources",
      "Growing AI resource collections",
      "High community contribution"
    ],
    verdict: "Worth Watching ⭐⭐⭐⭐⭐",
    score: "99/100",
  },
  {
    id: "wt-2",
    name: "vercel/next.js",
    headline: "Why trending:",
    reasons: [
      "New framework updates",
      "Enterprise adoption",
      "Strong developer ecosystem",
    ],
    verdict: "Learn Now 🚀",
    score: "95/100",
  },
  {
    id: "wt-3",
    name: "anthropics/anthropic-cookbook",
    headline: "Growth signals:",
    reasons: [
      "Claude 3.5 Sonnet release",
      "High quality reference code",
      "Increasing agentic adoption",
    ],
    verdict: "Fast Growing 📈",
    score: "92/100",
  }
];

import { fetchWhyTrendingIntelligence } from "./ollagraph-handlers";

/**
 * Async fetcher ready for Ollagraph integration.
 * Will replace static WHY_TRENDING_DATA in future UI updates.
 */
export async function getWhyTrendingData() {
  return fetchWhyTrendingIntelligence();
}
