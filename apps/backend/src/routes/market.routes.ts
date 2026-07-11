import { Router } from "express";
import { MarketService } from "../services/intelligence/market.service";

const router = Router();

router.get("/", async (req, res) => {
  const signals = await MarketService.getMarketSignals();
  res.json({
    overview: {
      totalRepos: 15420,
      avgStarGrowth: 150,
      topLanguage: "TypeScript",
      topCategory: "AI Tools"
    },
    techTrends: {
      "Rust Adoption": {
        weeklyGrowth: 95.5,
        totalRepos: 1200,
        trendingScore: 99
      },
      "Local LLMs": {
        weeklyGrowth: 120.2,
        totalRepos: 450,
        trendingScore: 98
      }
    },
    risingTools: [
      {
        id: "1",
        owner: "biomejs",
        name: "biome",
        description: "A toolchain for web projects, aimed to provide functionalities to maintain them.",
        stars: 12000,
        language: "Rust"
      }
    ],
    companyActivity: [
      {
        company: "Vercel",
        activeRepos: 5,
        totalStars: 50000,
        popularProjects: [{ name: "next.js" }, { name: "turborepo" }]
      }
    ],
    signals
  });
});

export default router;
