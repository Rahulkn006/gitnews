"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollima = exports.OllimaService = void 0;
class OllimaService {
    /**
     * Generates structured repository intelligence using Ollima API
     */
    async generateIntelligence(repoData, owner, repo) {
        const prompt = `Act as an expert developer AI analyst. You are analyzing the GitHub repository ${owner}/${repo} (${repoData.description || "No description"}).
Stars: ${repoData.stargazers_count}
Language: ${repoData.language}
Forks: ${repoData.forks_count}
Open Issues: ${repoData.open_issues_count}

Generate a comprehensive repository intelligence report.
Return ONLY a valid JSON object with EXACTLY these keys:
"summary": What the repository does and why developers use it,
"whyTrending": Why it is trending and adoption signals,
"difficulty": Beginner/intermediate/advanced and required knowledge,
"strengths": Array of string advantages/strengths,
"limitations": Array of string limitations/concerns,
"useCases": Array of string scenarios where someone should use this,
"alternatives": Array of string competing repositories.`;
        try {
            // 1. Try local Ollama processing
            try {
                const ollamaRes = await fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "llama3",
                        prompt: prompt,
                        format: "json",
                        stream: false,
                    }),
                });
                if (ollamaRes.ok) {
                    const data = await ollamaRes.json();
                    const parsed = JSON.parse(data.response);
                    return {
                        summary: parsed.summary || "",
                        whyTrending: parsed.whyTrending || "",
                        difficulty: parsed.difficulty || "",
                        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
                        limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
                        useCases: Array.isArray(parsed.useCases) ? parsed.useCases : [],
                        alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : [],
                    };
                }
            }
            catch (e) {
                console.log("[Ollima] Local Ollama unavailable, falling back to Ollima API...");
            }
            const ollimaKey = process.env.OLLIMA_API_KEY;
            if (ollimaKey) {
                // Using standard OpenAI compatible endpoint for Ollima API
                const res = await fetch("https://api.ollima.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${ollimaKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: prompt }],
                        response_format: { type: "json_object" },
                    }),
                });
                if (res.ok) {
                    const data = await res.json();
                    const content = data.choices[0].message.content;
                    const parsed = JSON.parse(content);
                    return {
                        summary: parsed.summary || "",
                        whyTrending: parsed.whyTrending || "",
                        difficulty: parsed.difficulty || "",
                        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
                        limitations: Array.isArray(parsed.limitations)
                            ? parsed.limitations
                            : [],
                        useCases: Array.isArray(parsed.useCases) ? parsed.useCases : [],
                        alternatives: Array.isArray(parsed.alternatives)
                            ? parsed.alternatives
                            : [],
                    };
                }
                else {
                    const text = await res.text();
                    console.error("[Ollima] API error:", res.status, text);
                    throw new Error("Ollima API error");
                }
            }
            else {
                throw new Error("OLLIMA_API_KEY not found in process.env and Ollama is unavailable");
            }
        }
        catch (e) {
            console.log("[Ollima] Intelligence generation failed, using unavailable status...", e);
            // Fallback response so the page does not crash
            return {
                summary: "AI intelligence temporarily unavailable",
                whyTrending: "AI intelligence temporarily unavailable",
                difficulty: "AI intelligence temporarily unavailable",
                strengths: [],
                limitations: [],
                useCases: [],
                alternatives: [],
            };
        }
    }
}
exports.OllimaService = OllimaService;
exports.ollima = new OllimaService();
//# sourceMappingURL=ollima.service.js.map