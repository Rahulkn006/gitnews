import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getNews = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("news")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const seedNews = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("news").collect();
    if (existing.length > 0) return;

    const initialNews = [
      {
        title: "Study finds code cleanliness impacts autonomous coding agents' performance",
        source: "arXiv / SonarSource",
        summary: "A new study by researchers at SonarSource examines how technical debt, code complexity, and lack of test coverage directly degrade autonomous coding agents' performance.",
        category: "AI Research",
        date: "06 Jul, 01:21 pm IST",
        url: "/news",
        createdAt: Date.now() - 1000 * 60 * 10,
      },
      {
        title: "GPT-5.6 Sol Ultra integrated into Codex platform",
        source: "Codex Labs",
        summary: "Codex has announced full integration of the new GPT-5.6 Sol Ultra model, yielding major performance boosts in multi-file repository maintenance and code refactoring workflows.",
        category: "AI Models",
        date: "06 Jul, 11:21 am IST",
        url: "/news",
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        title: "Orbital seeks FCC approval for 100,000 satellites to power space AI data centres",
        source: "TechCrunch",
        summary: "Orbital has filed with the FCC for a massive low Earth orbit satellite network designed to host AI hardware in space, avoiding terrestrial cooling constraints and clean energy grid locks.",
        category: "Infrastructure",
        date: "05 Jul, 07:22 am IST",
        url: "/news",
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        title: "OpenAI proposes donating 5% equity to US sovereign wealth fund",
        source: "Reuters",
        summary: "In a bid to satisfy regulatory concerns, OpenAI discussed allocating a 5% equity stake to a US sovereign wealth fund to support public infrastructure projects related to computing.",
        category: "Policy & Business",
        date: "02 Jul, 09:22 pm IST",
        url: "/news",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      },
      {
        title: "Snorkel AI launches Senior SWE-Bench to evaluate coding agents",
        source: "VentureBeat",
        summary: "Snorkel AI has introduced a new evaluation benchmark focusing on senior-level engineering tasks, testing systems on complex design patterns, system migrations, and security checks.",
        category: "AI Tools",
        date: "02 Jul, 05:21 pm IST",
        url: "/news",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      },
      {
        title: "GitHub project cuts AI token use by 65% with caveman-style code prompt technique",
        source: "GitHub Trending",
        summary: "A viral project called Caveman proves that dropping structural grammar and punctuation in prompts cuts LLM tokens by 65% while keeping performance parity.",
        category: "Developer Tools",
        date: "03 Jul, 07:21 am IST",
        url: "/news",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60,
      }
    ];

    for (const item of initialNews) {
      await ctx.db.insert("news", item);
    }
  },
});
