import { Router } from "express";
import { RepositoryDatabase } from "../database/repository.database";

const router = Router();

const ELITE_COMPANIES = [
  { id: "google", name: "Google", category: "Big Tech", summary: "Pioneering AI, search, and cloud infrastructure.", realScore: 99, mainLanguages: ["C++", "Python", "Go"] },
  { id: "microsoft", name: "Microsoft", category: "Big Tech", summary: "Building developer ecosystems, VS Code, and Azure.", realScore: 98, mainLanguages: ["TypeScript", "C#"] },
  { id: "meta", name: "Meta", category: "Big Tech", summary: "Open sourcing AI models like Llama and UI frameworks like React.", realScore: 98, mainLanguages: ["C++", "Python", "JavaScript"] },
  { id: "amazon", name: "Amazon", category: "Big Tech", summary: "Powering the cloud with AWS and massive e-commerce infrastructure.", realScore: 95, mainLanguages: ["Java", "Rust"] },
  { id: "netflix", name: "Netflix", category: "Big Tech", summary: "Streaming giants pioneering microservices and Chaos Engineering.", realScore: 94, mainLanguages: ["Java", "JavaScript"] },
  { id: "uber", name: "Uber", category: "Tech", summary: "Ride-sharing architecture and open-source infrastructure tools.", realScore: 92, mainLanguages: ["Go", "Java"] },
  { id: "airbnb", name: "Airbnb", category: "Tech", summary: "Hospitality tech and open-source frontend standards.", realScore: 90, mainLanguages: ["JavaScript", "Ruby"] },
  { id: "stripe", name: "Stripe", category: "FinTech", summary: "Developer-first payment infrastructure.", realScore: 96, mainLanguages: ["Ruby", "TypeScript"] },
  { id: "cloudflare", name: "Cloudflare", category: "Infrastructure", summary: "Edge computing and web security.", realScore: 95, mainLanguages: ["Rust", "Go"] },
  { id: "vercel", name: "Vercel", category: "Developer Tools", summary: "Revolutionizing frontend development with Next.js.", realScore: 97, mainLanguages: ["TypeScript", "Rust"] },
  { id: "openai", name: "OpenAI", category: "AI Lab", summary: "Pioneering artificial general intelligence.", realScore: 97, mainLanguages: ["Python", "C++"] },
  { id: "apple", name: "Apple", category: "Big Tech", summary: "Consumer hardware, Swift, and WebKit.", realScore: 94, mainLanguages: ["Swift", "C++"] },
  { id: "nvidia", name: "NVIDIA", category: "Hardware/AI", summary: "Accelerated computing and AI hardware.", realScore: 98, mainLanguages: ["C++", "CUDA"] },
  { id: "docker", name: "Docker", category: "Developer Tools", summary: "Containerization standard.", realScore: 92, mainLanguages: ["Go"] },
  { id: "hashicorp", name: "HashiCorp", category: "Infrastructure", summary: "Cloud infrastructure automation.", realScore: 93, mainLanguages: ["Go"] },
  { id: "github", name: "GitHub", category: "Developer Tools", summary: "Where the world builds software.", realScore: 97, mainLanguages: ["Ruby", "Go"] }
];

router.get("/", async (req, res) => {
  try {
    // We map only the allowed companies instead of random users
    const companies = ELITE_COMPANIES.map(company => {
      // In a real scenario, this fetches aggregate from RepositoryDatabase
      return {
        id: company.id,
        name: company.name,
        avatar: `https://github.com/${company.id}.png`,
        category: company.category,
        summary: company.summary,
        totalStars: Math.floor(Math.random() * 500000) + 100000, // mock aggregate for UI
        repoCount: Math.floor(Math.random() * 500) + 50,
        engineeringScore: company.realScore,
        mainLanguages: company.mainLanguages,
        activeProjectsCount: Math.floor(Math.random() * 50) + 10,
        primaryAreas: ["Infrastructure", "AI"],
        topProjects: [], // could populate real repos here
      };
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const companyMeta = ELITE_COMPANIES.find(c => c.id === slug);
    
    if (!companyMeta) {
      return res.status(404).json({ error: "Company not found" });
    }
    
    const repos = await RepositoryDatabase.getTrendingRepositories();
    const companyRepos = repos.filter(r => r.owner.toLowerCase() === slug);
    
    // Group & map DNA categories
    const dna = companyMeta.mainLanguages.map(lang => {
      let langRepos = companyRepos.filter(r => r.language?.toLowerCase() === lang.toLowerCase());
      
      // Fallback mocks for UI visual presentation if DB has no synced repos for this company
      if (langRepos.length === 0) {
        langRepos = [
          { name: `${lang.toLowerCase()}-core`, stars: 12500 + Math.floor(Math.random() * 5000), repoUrl: `https://github.com/${slug}/${lang.toLowerCase()}-core` } as any,
          { name: `${lang.toLowerCase()}-toolkit`, stars: 8400 + Math.floor(Math.random() * 3000), repoUrl: `https://github.com/${slug}/${lang.toLowerCase()}-toolkit` } as any,
          { name: `awesome-${slug}`, stars: 3200 + Math.floor(Math.random() * 1000), repoUrl: `https://github.com/${slug}/awesome-${slug}` } as any
        ];
      }
      
      return {
        category: lang,
        repos: langRepos.slice(0, 5).map(r => ({
          name: r.name,
          repoUrl: r.repoUrl || `https://github.com/${slug}/${r.name}`,
          stars: r.stars
        }))
      };
    });

    // Generate language distribution
    const languages = companyMeta.mainLanguages.map((lang, idx) => ({
      name: lang,
      value: 12 - idx * 3
    }));

    // Generate topic/domain focus distribution
    const topics = ["Infrastructure", "AI", "Developer Tools", "Web", "Cloud"].slice(0, 3).map((topic, idx) => ({
      name: topic,
      value: 18 - idx * 4
    }));

    // Mock top repos if none are in DB
    const COMPANY_TOP_REPOS: Record<string, any[]> = {
      google: [
        { name: "tensorflow", description: "An Open Source Machine Learning Framework for Everyone", stars: 182000, growth7d: 150, language: "C++", repoUrl: "https://github.com/tensorflow/tensorflow" },
        { name: "angular", description: "Deliver web apps with confidence", stars: 95000, growth7d: 85, language: "TypeScript", repoUrl: "https://github.com/angular/angular" },
        { name: "guava", description: "Google core libraries for Java", stars: 49000, growth7d: 40, language: "Java", repoUrl: "https://github.com/google/guava" }
      ],
      microsoft: [
        { name: "vscode", description: "Visual Studio Code", stars: 162000, growth7d: 210, language: "TypeScript", repoUrl: "https://github.com/microsoft/vscode" },
        { name: "TypeScript", description: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output.", stars: 99000, growth7d: 130, language: "TypeScript", repoUrl: "https://github.com/microsoft/TypeScript" },
        { name: "terminal", description: "The new Windows Terminal and the original Windows console host", stars: 94000, growth7d: 65, language: "C++", repoUrl: "https://github.com/microsoft/terminal" }
      ],
      meta: [
        { name: "react", description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.", stars: 224000, growth7d: 345, language: "JavaScript", repoUrl: "https://github.com/facebook/react" },
        { name: "react-native", description: "A framework for building native applications using React.", stars: 115000, growth7d: 180, language: "JavaScript", repoUrl: "https://github.com/facebook/react-native" },
        { name: "folly", description: "An open-source C++ library developed and used at Facebook.", stars: 27000, growth7d: 25, language: "C++", repoUrl: "https://github.com/facebook/folly" }
      ],
      vercel: [
        { name: "next.js", description: "The React Framework", stars: 122000, growth7d: 410, language: "JavaScript", repoUrl: "https://github.com/vercel/next.js" },
        { name: "hyper", description: "A terminal built on web technologies", stars: 43000, growth7d: 15, language: "TypeScript", repoUrl: "https://github.com/vercel/hyper" }
      ]
    };

    const topRepos = companyRepos.length > 0 
      ? companyRepos 
      : (COMPANY_TOP_REPOS[slug] || [
          { name: `${slug}-core`, description: `The primary development core library for ${companyMeta.name}`, stars: 15000, growth7d: 120, language: companyMeta.mainLanguages[0], repoUrl: `https://github.com/${slug}/${slug}-core` }
        ]);

    res.json({
      name: companyMeta.name,
      avatar: `https://github.com/${slug}.png`,
      overview: { 
        score: companyMeta.realScore, 
        totalStars: topRepos.reduce((acc, curr) => acc + (curr.stars || 0), 0) || 500000, 
        totalForks: Math.floor((topRepos.reduce((acc, curr) => acc + (curr.stars || 0), 0) || 500000) * 0.2), 
        totalRepos: topRepos.length, 
        activeProjects: topRepos.length 
      },
      dna,
      topRepos,
      techDistribution: { languages, topics },
      developerInsight: companyMeta.summary
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch company details" });
  }
});

export default router;
