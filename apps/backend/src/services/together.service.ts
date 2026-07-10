import OpenAI from "openai";

type AiAnalysisResult = {
  aiSummary: string;
  developerAnalysis?: {
    targetAudience: string;
    ecosystemFit: string;
  };
  verdict?: {
    learningValue: string;
    futurePotential: string;
    communityStrength: string;
    summary: string;
  };
};

export class TogetherService {
  private static getOpenAIClient() {
    return new OpenAI({
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: process.env.TOGETHER_BASE_URL,
    });
  }

  static async buildAiAnalysis(repo: any, readme?: string): Promise<AiAnalysisResult> {
    const language = repo.language ?? "general purpose";
    const stars = repo.stargazers_count || repo.stars;
    const description = repo.description ? ` ${repo.description}` : "";
    const fallbackSummary = `A ${language} repository${description} with ${stars} stars and strong community momentum.`;

    if (!process.env.TOGETHER_API_KEY) {
      return { aiSummary: fallbackSummary };
    }

    try {
      const openai = this.getOpenAIClient();
      const textToAnalyze = `
Name: ${repo.name}
Description: ${repo.description ?? "None"}
Language: ${repo.language ?? "None"}
Topics: ${(repo.topics ?? []).join(", ")}
Stars: ${stars}
Readme Excerpt: ${(readme ?? "").slice(0, 1000)}
      `;

      const response = await openai.chat.completions.create({
        model: "meta-llama/Llama-3-70b-chat-hf",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a professional tech analyst. Analyze the GitHub repository and output ONLY a JSON object with the following schema:
{
  "aiSummary": "A concise, 1-sentence description summarizing its main purpose, uniqueness, and ideal developer use-case (under 20 words).",
  "developerAnalysis": {
    "targetAudience": "Who is this for? e.g., 'Beginner friendly.', 'Enterprise ready.', or 'Startups and mid-sized teams.'",
    "ecosystemFit": "How it fits into modern workflows. e.g., 'Integrates well into modern React workflows.'"
  },
  "verdict": {
    "learningValue": "e.g., 'Excellent', 'Good', 'Average'",
    "futurePotential": "e.g., 'High', 'Moderate', 'Low'",
    "communityStrength": "e.g., 'Very Active', 'Growing', 'Stable'",
    "summary": "A 1-2 sentence final verdict on why developers should or should not use this."
  }
}`,
          },
          {
            role: "user",
            content: textToAnalyze,
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        try {
          const parsed = JSON.parse(content) as AiAnalysisResult;
          if (parsed.aiSummary) return parsed;
        } catch (parseErr) {
          console.error("Failed to parse JSON from AI", parseErr);
        }
      }
    } catch (err) {
      console.error("Together AI summarization failed:", err);
    }

    return { aiSummary: repo.description ?? fallbackSummary };
  }
}
