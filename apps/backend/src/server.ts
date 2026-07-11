import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import aiRoutes from "./routes/ai.routes";
import repositoriesRoutes from "./routes/repositories.routes";
import companiesRoutes from "./routes/companies.routes";
import battleRoutes from "./routes/battle.routes";
import marketRoutes from "./routes/market.routes";
import newsRoutes from "./routes/news.routes";
import { startScheduler } from "./scheduler/githubSync";
import { GitHubService } from "./services/github.service";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/repositories", repositoriesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/news", newsRoutes);

app.post("/api/sync/github", async (req, res) => {
  try {
    // Run sync in background
    GitHubService.syncGitHubData().catch(console.error);
    res.json({ message: "GitHub Sync started" });
  } catch (error) {
    res.status(500).json({ error: "Failed to start sync" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

startScheduler();

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
