import { Router } from "express";
import { RepositoryDatabase } from "../database/repository.database";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Return mock news or fetch from DB
    res.json([
      { id: "1", title: "GitNews migrating to REST API", content: "The transition from Convex to a standard Node backend is complete.", createdAt: new Date().toISOString() }
    ]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
