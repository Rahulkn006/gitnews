import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTrendingRepositories = query({
  args: {
    timeFilter: v.optional(v.string()), // 'today', 'week', 'month'
    category: v.optional(v.string()), // 'all', 'ai', 'frontend', etc.
    sort: v.optional(v.string()), // 'score', 'stars', 'growth', 'updated'
  },
  handler: async (ctx, args) => {
    // 1. Fetch repositories ordered by trendingScore to get a solid base
    const repos = await ctx.db
      .query("repositories")
      .withIndex("by_trending")
      .order("desc")
      .take(200);

    let filtered = repos;

    // Filter by Time using updatedAt
    // Note: Since this is a live sync, the actual "trending this week" might be complex to calculate without snapshots.
    // We'll use updatedAt as a proxy for recent activity.
    const now = Date.now();
    if (args.timeFilter === "today") {
      filtered = filtered.filter(
        (r) => r.updatedAt > now - 24 * 60 * 60 * 1000,
      );
    } else if (args.timeFilter === "week") {
      filtered = filtered.filter(
        (r) => r.updatedAt > now - 7 * 24 * 60 * 60 * 1000,
      );
    } else if (args.timeFilter === "month") {
      filtered = filtered.filter(
        (r) => r.updatedAt > now - 30 * 24 * 60 * 60 * 1000,
      );
    }

    // Filter by Category
    if (args.category && args.category.toLowerCase() !== "all") {
      const targetCat = args.category.toLowerCase();
      filtered = filtered.filter((r) => {
        const topics = (r.topics || []).map((t) => t.toLowerCase());
        const cat = (r.category || "").toLowerCase();

        if (targetCat === "ai") {
          return (
            topics.some(
              (t) =>
                t.includes("ai") ||
                t.includes("llm") ||
                t.includes("machine-learning"),
            ) || cat.includes("ai")
          );
        }
        if (targetCat === "frontend") {
          return (
            topics.includes("frontend") ||
            r.language === "TypeScript" ||
            r.language === "JavaScript" ||
            r.language === "Vue"
          );
        }
        if (targetCat === "backend") {
          return (
            topics.includes("backend") ||
            r.language === "Go" ||
            r.language === "Rust" ||
            r.language === "Java"
          );
        }
        if (targetCat === "devops") {
          return (
            topics.includes("devops") ||
            topics.includes("docker") ||
            topics.includes("kubernetes")
          );
        }
        if (targetCat === "database") {
          return (
            topics.includes("database") ||
            topics.includes("sql") ||
            cat.includes("database")
          );
        }
        if (targetCat === "security") {
          return topics.includes("security") || cat.includes("security");
        }

        return cat === targetCat || topics.includes(targetCat);
      });
    }

    // Sort priority
    if (args.sort === "stars") {
      filtered.sort((a, b) => b.stars - a.stars);
    } else if (args.sort === "growth") {
      filtered.sort((a, b) => (b.growth24h || 0) - (a.growth24h || 0));
    } else if (args.sort === "updated") {
      filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      // Default: score
      filtered.sort((a, b) => {
        if (b.trendingScore !== a.trendingScore)
          return b.trendingScore - a.trendingScore;
        if ((b.growth24h || 0) !== (a.growth24h || 0))
          return (b.growth24h || 0) - (a.growth24h || 0);
        if (b.stars !== a.stars) return b.stars - a.stars;
        if (b.forks !== a.forks) return b.forks - a.forks;
        return b.updatedAt - a.updatedAt;
      });
    }

    return filtered.slice(0, 50); // Return top 50
  },
});

export const getTrendingStats = query({
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").take(150);
    const totalCount = await ctx.db.query("repositories").collect();

    const languages: Record<string, number> = {};
    const categories: Record<string, number> = {};

    for (const r of repos) {
      if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;

      const cat = r.category || (r.topics && r.topics[0]);
      if (cat) {
        categories[cat] = (categories[cat] || 0) + 1;
      }
    }

    const topLanguage =
      Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";
    const hotCategory =
      Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";

    return {
      totalTracked: totalCount.length,
      trendingCount: repos.filter((r) => r.trendingScore > 0).length,
      topLanguage,
      hotCategory,
    };
  },
});
