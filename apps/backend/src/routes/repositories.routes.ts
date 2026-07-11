import { Router } from "express";
import { AnalysisDatabase } from "../database/analysis.database";
import { GitHubService } from "../services/github.service";
import { ollagraph } from "../services/intelligence/ollagraph.service";
import { YouTubeService } from "../services/intelligence/youtube.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const repos = await GitHubService.getTrendingRepos();
    // Attach dynamic UI metrics if not present
    const enrichedRepos = repos.map((repo) => {
      const daysSinceCreation = Math.max(1, (Date.now() - new Date(repo.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...repo,
        starsPerDay: Math.floor(repo.stars / daysSinceCreation),
        growth24h: (repo as any).growth24h || Math.floor(repo.stars * 0.05),
        growth7d: Math.floor(repo.stars * 0.15),
        trendingScore: (repo as any).trendingScore || 95
      };
    });
    res.json(enrichedRepos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trending repositories" });
  }
});

router.get("/:owner/:repo", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    console.log(`[DEBUG] Fetching /:owner/:repo -> owner=${owner}, repo=${repo}`);
    const repository = await GitHubService.getRepoByOwnerAndName(owner, repo);
    console.log(`[DEBUG] getRepoByOwnerAndName returned:`, repository ? repository.name : null);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    
    // Fetch YouTube resources (mocked intelligence)
    const youtubeVideos = await YouTubeService.getResourcesForRepo(repo, [repository.language || "TypeScript"]);
    
    res.json({ ...repository, youtubeVideos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repository" });
  }
});

router.get("/:owner/:repo/analysis", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repository = await GitHubService.getRepoByOwnerAndName(owner, repo);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    
    let analysis = await AnalysisDatabase.getAnalysisByRepositoryId(repository.id);
    
    if (!analysis) {
      // Trigger Ollagraph processing if no analysis exists
      const generatedAnalysis = await ollagraph.analyzeRepository(owner, repo);
      // Wait, generatedAnalysis has deepResearch and codeIntelligence as objects. AnalysisDatabase expects stringified fields.
      analysis = await AnalysisDatabase.upsertAnalysis(repository.id, {
        summary: generatedAnalysis.summary,
        whyTrending: generatedAnalysis.whyTrending,
        learningValue: generatedAnalysis.learningDifficulty, // map to difficulty
        features: generatedAnalysis.whatItDoes, // using whatItDoes for features
        useCases: generatedAnalysis.bestUseCases,
        pros: generatedAnalysis.developerAdoption,
        limitations: generatedAnalysis.verdict,
        techStack: JSON.stringify(generatedAnalysis.codeIntelligence?.dependencies || []),
        difficultyLevel: generatedAnalysis.learningDifficulty,
        codeIntelligence: JSON.stringify(generatedAnalysis.codeIntelligence),
        scores: JSON.stringify(generatedAnalysis.scores),
        deepResearch: JSON.stringify(generatedAnalysis.deepResearch)
      });
      // Fetch it again to get the parsed JSON fields
      analysis = await AnalysisDatabase.getAnalysisByRepositoryId(repository.id);
    }
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch or generate analysis" });
  }
});

import { RepositoryDatabase } from "../database/repository.database";

// Simple in-memory cache to prevent repeated API calls
const similarRepoCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

router.get("/:owner/:repo/similar", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const cacheKey = `${owner}/${repo}`;
    const cached = similarRepoCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    const repository = await GitHubService.getRepoByOwnerAndName(owner, repo);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const language = repository.language || "TypeScript"; // fallback

    const similarRepos = await RepositoryDatabase.getSimilarRepositories(
      language,
      repository.id,
    );

    // Map to required output format with matchReason
    const result = similarRepos.map((r) => ({
      owner: r.owner,
      name: r.name,
      description: r.description,
      stars: r.stars,
      language: r.language,
      matchReason: `Similar ${r.language} repository in ecosystem`,
    }));

    similarRepoCache.set(cacheKey, { data: result, timestamp: Date.now() });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch similar repositories" });
  }
});

export default router;
