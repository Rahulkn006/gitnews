"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repository_database_1 = require("../database/repository.database");
const router = (0, express_1.Router)();
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
    }
    catch (error) {
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
        const repos = await repository_database_1.RepositoryDatabase.getTrendingRepositories();
        const companyRepos = repos.filter(r => r.owner.toLowerCase() === slug);
        res.json({
            name: companyMeta.name,
            avatar: `https://github.com/${slug}.png`,
            overview: {
                score: companyMeta.realScore,
                totalStars: 500000,
                totalForks: 100000,
                totalRepos: companyRepos.length,
                activeProjects: companyRepos.length
            },
            dna: companyMeta.mainLanguages,
            topRepos: companyRepos,
            techDistribution: { languages: companyMeta.mainLanguages, topics: ["Cloud", "AI"] },
            developerInsight: companyMeta.summary
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch company details" });
    }
});
exports.default = router;
//# sourceMappingURL=companies.routes.js.map