import { Router } from 'express';
import { GitHubService } from '../services/github.service';
import { AnalysisDatabase } from '../database/analysis.database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const repos = await GitHubService.getTrendingRepos();
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending repositories' });
  }
});

router.get('/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repository = await GitHubService.getRepoByOwnerAndName(owner, repo);
    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    res.json(repository);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repository' });
  }
});

router.get('/:owner/:repo/analysis', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repository = await GitHubService.getRepoByOwnerAndName(owner, repo);
    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    const analysis = await AnalysisDatabase.getAnalysisByRepositoryId(repository.id);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

import { RepositoryDatabase } from '../database/repository.database';

// Simple in-memory cache to prevent repeated API calls
const similarRepoCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

router.get('/:owner/:repo/similar', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const cacheKey = `${owner}/${repo}`;
    const cached = similarRepoCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }
    
    const repository = await GitHubService.getRepoByOwnerAndName(owner, repo);
    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const language = repository.language || 'TypeScript'; // fallback
    
    const similarRepos = await RepositoryDatabase.getSimilarRepositories(language, repository.id);
    
    // Map to required output format with matchReason
    const result = similarRepos.map(r => ({
      owner: r.owner,
      name: r.name,
      description: r.description,
      stars: r.stars,
      language: r.language,
      matchReason: `Similar ${r.language} repository in ecosystem`
    }));
    
    similarRepoCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar repositories' });
  }
});

export default router;
