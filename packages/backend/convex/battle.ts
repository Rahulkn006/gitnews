import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const getRepoDetails = internalQuery({
  args: { id: v.id("repositories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const compareRepositories = action({
  args: {
    repoAId: v.id("repositories"),
    repoBId: v.id("repositories"),
  },
  handler: async (ctx, args) => {
    const repoA = await ctx.runQuery(internal.battle.getRepoDetails, { id: args.repoAId });
    const repoB = await ctx.runQuery(internal.battle.getRepoDetails, { id: args.repoBId });

    if (!repoA || !repoB) {
      throw new Error("One or both repositories not found.");
    }

    const githubA = await fetchRepoExtraDetails(repoA.owner, repoA.name);
    const githubB = await fetchRepoExtraDetails(repoB.owner, repoB.name);

    // Scoring formula: stars 25%, growth 25%, activity 20%, issues 15%, community 15%
    const scoreA = calculateBaseScore(repoA, githubA);
    const scoreB = calculateBaseScore(repoB, githubB);

    const apiKey = process.env.OLLIMA_API_KEY;
    if (!apiKey) {
      throw new Error("OLLIMA_API_KEY missing in backend.");
    }

    const prompt = `Act as an expert technical advisor for developers. Compare these two open-source repositories:
    
Repo A: ${repoA.name} (${repoA.owner})
Description: ${repoA.description || repoA.aiSummary || 'N/A'}
Stars: ${repoA.stars}
Forks: ${repoA.forks}
Language: ${repoA.language || 'N/A'}
Topics: ${repoA.topics?.join(', ') || 'N/A'}
Growth 24h: ${repoA.growth24h || 0}
Growth 7d: ${repoA.growth7d || 0}
Open Issues: ${githubA?.open_issues_count || 'Unknown'}
Last Pushed: ${githubA?.pushed_at || 'Unknown'}

Repo B: ${repoB.name} (${repoB.owner})
Description: ${repoB.description || repoB.aiSummary || 'N/A'}
Stars: ${repoB.stars}
Forks: ${repoB.forks}
Language: ${repoB.language || 'N/A'}
Topics: ${repoB.topics?.join(', ') || 'N/A'}
Growth 24h: ${repoB.growth24h || 0}
Growth 7d: ${repoB.growth7d || 0}
Open Issues: ${githubB?.open_issues_count || 'Unknown'}
Last Pushed: ${githubB?.pushed_at || 'Unknown'}

Return ONLY a valid JSON object with the following structure:
{
  "winner": "Name of the winning repo (Repo A or Repo B)",
  "winningReasons": ["Reason 1 (e.g. adoption)", "Reason 2 (e.g. developer activity)", "Reason 3 (e.g. ecosystem strength)"],
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

    const res = await fetch("https://api.ollima.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      console.error("Ollima API failed", await res.text());
      throw new Error("Failed to generate AI synthesis.");
    }

    const data = await res.json();
    let synthesis;
    try {
      synthesis = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse JSON from Ollima", e);
      throw new Error("AI returned invalid JSON.");
    }

    // In the new system, we just use the raw score calculated by the formula
    const finalScoreA = Math.min(100, Math.round(scoreA));
    const finalScoreB = Math.min(100, Math.round(scoreB));

    return {
      repoA: { ...repoA, finalScore: finalScoreA, githubData: githubA },
      repoB: { ...repoB, finalScore: finalScoreB, githubData: githubB },
      synthesis
    };
  }
});

async function fetchRepoExtraDetails(owner: string, name: string) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: any = { "User-Agent": "GitNews-Battle" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
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
  
  // Stars 25% (Scale up to 100k for max)
  score += Math.min(25, ((repo.stars || 0) / 100000) * 25);
  
  // Growth velocity 25% (Scale to 1000 combined growth)
  const growth = (repo.growth7d || 0) + (repo.growth24h || 0);
  score += Math.min(25, (growth / 1000) * 25);
  
  // Recent commits/activity 20%
  // Using pushed_at as primary indicator of recent commits
  let daysSinceUpdate = 365; // Default to old
  if (githubData?.pushed_at) {
    daysSinceUpdate = (Date.now() - new Date(githubData.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
  } else if (repo.updatedAt) {
    daysSinceUpdate = (Date.now() - repo.updatedAt) / (1000 * 60 * 60 * 24);
  }
  score += Math.max(0, 20 - (daysSinceUpdate / 5)); // Decays faster, max 20
  
  // Issues health 15% (Healthy = not too many open issues compared to stars)
  const openIssues = githubData?.open_issues_count || 0;
  if (repo.stars > 0) {
    const issueRatio = openIssues / repo.stars;
    // Lower ratio is better. If issueRatio < 0.05, max points.
    score += Math.min(15, Math.max(0, 15 - (issueRatio * 150))); 
  } else {
    score += 7; // Average if no stars
  }
  
  // Fork/community 15% (Scale to 10k forks)
  score += Math.min(15, ((repo.forks || 0) / 10000) * 15);
  
  // Minimum baseline so we don't have zeros for big repos just because we missed a stat
  return Math.max(30, score);
}
