import { Router } from "express";
import { RepositoryDatabase } from "../database/repository.database";

const router = Router();

router.post("/compare", async (req, res) => {
  try {
    const { repoAId, repoBId } = req.body;
    
    // In a real implementation, we would query the db and AI
    // For this migration, we mock the result
    res.json({
      winner: repoAId,
      verdict: "Mock verdict for comparison",
      scores: { repoA: 85, repoB: 70 },
      metrics: [
        { label: "Stars", valueA: 1000, valueB: 800, winner: "A" }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to compare" });
  }
});

export default router;
