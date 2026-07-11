import { Router } from "express";
import { MarketService } from "../services/intelligence/market.service";

const router = Router();

router.get("/", async (req, res) => {
  const signals = await MarketService.getMarketSignals();
  res.json({
    overview: {
      totalRepositories: 15420,
      activeDevelopers: 8900,
      trendingTopics: ["AI", "React", "TypeScript"]
    },
    techTrends: signals.filter(s => s.type === "technology_trend").map(s => ({ name: s.name, growth: s.score })),
    risingTools: [
      { name: "Biome", stars: 12000, description: "Fast formatter" }
    ],
    companyActivity: [
      { name: "Vercel", recentRepos: 5, score: 95 }
    ],
    signals
  });
});

export default router;
