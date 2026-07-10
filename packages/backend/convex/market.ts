import { query } from "./_generated/server";

export const getMarketOverview = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    if (repos.length === 0) {
      return { totalRepos: 0, trendingToday: null, avgStarGrowth: 0, topLanguage: "", topCategory: "" };
    }

    const totalRepos = repos.length;
    
    // Find highest trending today
    const trendingToday = repos.reduce((prev, current) => {
      return (prev.trendingScore > current.trendingScore) ? prev : current;
    });

    // Avg star growth (using growth24h)
    const validGrowthRepos = repos.filter(r => typeof r.growth24h === 'number');
    const avgStarGrowth = validGrowthRepos.length > 0
      ? validGrowthRepos.reduce((acc, curr) => acc + (curr.growth24h || 0), 0) / validGrowthRepos.length
      : 0;

    // Most active language
    const langCounts: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    });
    let topLanguage = "N/A";
    let maxLangCount = 0;
    for (const [lang, count] of Object.entries(langCounts)) {
      if (count > maxLangCount) {
        maxLangCount = count;
        topLanguage = lang;
      }
    }

    // Fastest growing category
    const catGrowth: Record<string, { sum: number; count: number }> = {};
    repos.forEach(r => {
      if (r.category && typeof r.growth24h === 'number') {
        if (!catGrowth[r.category]) catGrowth[r.category] = { sum: 0, count: 0 };
        catGrowth[r.category].sum += r.growth24h;
        catGrowth[r.category].count++;
      }
    });
    let topCategory = "N/A";
    let maxCatAvg = -1;
    for (const [cat, data] of Object.entries(catGrowth)) {
      const avg = data.sum / data.count;
      if (avg > maxCatAvg) {
        maxCatAvg = avg;
        topCategory = cat;
      }
    }

    return {
      totalRepos,
      trendingToday: {
        name: trendingToday.name,
        owner: trendingToday.owner,
        stars: trendingToday.stars
      },
      avgStarGrowth: Math.round(avgStarGrowth),
      topLanguage,
      topCategory
    };
  }
});

export const getTechnologyTrends = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    
    const targetTechs = ["react", "next.js", "python", "rust", "go", "docker", "kubernetes", "ai"];
    
    const results: Record<string, { totalRepos: number, totalStars: number, weeklyGrowth: number, trendingScore: number, topRepo: any }> = {};

    for (const tech of targetTechs) {
      const matchingRepos = repos.filter(r => {
        const searchStr = `${r.language || ''} ${r.topics?.join(' ') || ''} ${r.category || ''} ${r.name} ${r.description || ''}`.toLowerCase();
        return searchStr.includes(tech);
      });

      if (matchingRepos.length === 0) continue;

      const totalRepos = matchingRepos.length;
      const totalStars = matchingRepos.reduce((acc, curr) => acc + curr.stars, 0);
      const weeklyGrowth = matchingRepos.reduce((acc, curr) => acc + (curr.growth7d || 0), 0);
      const trendingScore = matchingRepos.reduce((acc, curr) => acc + curr.trendingScore, 0) / totalRepos;
      const topRepo = matchingRepos.reduce((prev, curr) => (prev.stars > curr.stars) ? prev : curr);

      results[tech] = {
        totalRepos,
        totalStars,
        weeklyGrowth,
        trendingScore: Math.round(trendingScore),
        topRepo: { name: topRepo.name, owner: topRepo.owner, stars: topRepo.stars }
      };
    }

    return results;
  }
});

export const getRisingTools = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    
    const rising = repos.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 10);
    
    return rising.map(r => ({
      id: r._id,
      name: r.name,
      owner: r.owner,
      description: r.description,
      stars: r.stars,
      growth: r.growth24h || 0,
      language: r.language || "Unknown",
      category: r.category || "Uncategorized",
      score: r.gitnewsScore || Math.round(r.trendingScore)
    }));
  }
});

export const getCompanyActivity = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    const companies = ["google", "microsoft", "meta", "netflix", "vercel", "openai", "cloudflare"];
    
    const results: any[] = [];

    for (const company of companies) {
      const matchingRepos = repos.filter(r => r.owner.toLowerCase() === company || r.owner.toLowerCase().includes(company));
      
      if (matchingRepos.length > 0) {
        const activeRepos = matchingRepos.length;
        const totalStars = matchingRepos.reduce((acc, curr) => acc + curr.stars, 0);
        
        const popularProjects = matchingRepos.sort((a, b) => b.stars - a.stars).slice(0, 3).map(r => ({
          name: r.name,
          stars: r.stars
        }));

        results.push({
          company,
          activeRepos,
          totalStars,
          popularProjects
        });
      }
    }

    return results.sort((a, b) => b.totalStars - a.totalStars);
  }
});
