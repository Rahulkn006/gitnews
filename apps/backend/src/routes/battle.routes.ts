import { Router } from "express";
import { RepositoryDatabase } from "../database/repository.database";
import { GitHubService } from "../services/github.service";

const router = Router();

router.post("/compare", async (req, res) => {
  try {
    const { repoAId, repoBId } = req.body;
    
    // Support either IDs (from frontend) or owner/repo format for flexibility
    // Frontend sends 'owner/repo' strings as IDs currently
    const [ownerA, nameA] = repoAId.split('/');
    const [ownerB, nameB] = repoBId.split('/');
    
    let repoA: any = await GitHubService.getRepoByOwnerAndName(ownerA, nameA);
    let repoB: any = await GitHubService.getRepoByOwnerAndName(ownerB, nameB);

    if (!repoA || !repoB) {
      return res.status(404).json({ error: "One or both repositories not found." });
    }

    const githubA = await fetchRepoExtraDetails(repoA.owner.login, repoA.name);
    const githubB = await fetchRepoExtraDetails(repoB.owner.login, repoB.name);

    // Scoring formula: stars 25%, growth 25%, activity 20%, issues 15%, community 15%
    const scoreA = calculateBaseScore(repoA, githubA);
    const scoreB = calculateBaseScore(repoB, githubB);

    const apiKey = process.env.OLLIMA_API_KEY;
    if (!apiKey) {
      console.error("OLLIMA_API_KEY missing in backend.");
      return res.status(500).json({ error: "Configuration error: Missing API Key" });
    }

    const prompt = `Act as an expert technical advisor for developers. Compare these two open-source repositories:
    
Repo A: ${repoA.name} (${repoA.owner.login})
Description: ${repoA.description || "N/A"}
Stars: ${repoA.stars}
Forks: ${repoA.forks}
Language: ${repoA.language || "N/A"}
Topics: ${repoA.topics?.join(", ") || "N/A"}
Growth 24h: ${repoA.growth24h || 0}
Growth 7d: ${repoA.growth7d || 0}
Open Issues: ${githubA?.open_issues_count || "Unknown"}
Last Pushed: ${githubA?.pushed_at || "Unknown"}

Repo B: ${repoB.name} (${repoB.owner.login})
Description: ${repoB.description || "N/A"}
Stars: ${repoB.stars}
Forks: ${repoB.forks}
Language: ${repoB.language || "N/A"}
Topics: ${repoB.topics?.join(", ") || "N/A"}
Growth 24h: ${repoB.growth24h || 0}
Growth 7d: ${repoB.growth7d || 0}
Open Issues: ${githubB?.open_issues_count || "Unknown"}
Last Pushed: ${githubB?.pushed_at || "Unknown"}

Return ONLY a valid JSON object with the following structure:
{
  "winner": "Name of the winning repo (Repo A or Repo B)",
  "winningReasons": ["Reason 1", "Reason 2", "Reason 3"],
  "developerVerdict": "A detailed paragraph explaining why the winner was chosen overall",
  "strengthsA": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknessesA": ["Weakness 1", "Weakness 2"],
  "strengthsB": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknessesB": ["Weakness 1", "Weakness 2"],
  "useCasesA": ["Use Case 1", "Use Case 2"],
  "useCasesB": ["Use Case 1", "Use Case 2"],
  "learningScoresA": {
    "beginnerFriendly": 85,
    "documentation": 90,
    "jobDemand": 95,
    "futurePotential": 80
  },
  "learningScoresB": {
    "beginnerFriendly": 70,
    "documentation": 80,
    "jobDemand": 85,
    "futurePotential": 90
  }
}`;

    const fetchRes = await fetch("https://api.ollima.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!fetchRes.ok) {
      console.error("Ollima API failed", await fetchRes.text());
      return res.status(500).json({ error: "Failed to generate AI synthesis." });
    }

    const data = await fetchRes.json();
    let synthesis;
    try {
      synthesis = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse JSON from Ollima", e);
      return res.status(500).json({ error: "AI returned invalid JSON." });
    }

    const finalScoreA = Math.min(100, Math.round(scoreA));
    const finalScoreB = Math.min(100, Math.round(scoreB));

    res.json({
      repoA: { ...repoA, finalScore: finalScoreA, githubData: githubA },
      repoB: { ...repoB, finalScore: finalScoreB, githubData: githubB },
      synthesis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compare" });
  }
});

async function fetchRepoExtraDetails(owner: string, name: string) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: any = { "User-Agent": "GitNews-Battle" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch extra GitHub details for", owner, name, e);
  }
  return null;
}

function calculateBaseScore(repo: any, githubData: any) {
  let score = 0;
  score += Math.min(25, ((repo.stars || 0) / 100000) * 25);
  const growth = (repo.growth7d || 0) + (repo.growth24h || 0);
  score += Math.min(25, (growth / 1000) * 25);
  let daysSinceUpdate = 365;
  if (githubData?.pushed_at) {
    daysSinceUpdate = (Date.now() - new Date(githubData.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
  } else if (repo.updatedAt) {
    daysSinceUpdate = (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  }
  score += Math.max(0, 20 - daysSinceUpdate / 5);
  const openIssues = githubData?.open_issues_count || 0;
  if (repo.stars > 0) {
    const issueRatio = openIssues / repo.stars;
    score += Math.min(15, Math.max(0, 15 - issueRatio * 150));
  } else {
    score += 7;
  }
  score += Math.min(15, ((repo.forks || 0) / 10000) * 15);
  return Math.max(30, score);
}

export default router;
