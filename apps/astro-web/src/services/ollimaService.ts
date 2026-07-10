export interface OllimaIntelligence {
  summary: string;
  whyTrending: string;
  difficulty: string;
  strengths: string[];
  limitations: string[];
  useCases: string[];
  alternatives: string[];
}

export class OllimaService {
  /**
   * Generates structured repository intelligence using Ollima API
   */
  async generateIntelligence(repoData: any, owner: string, repo: string): Promise<OllimaIntelligence> {
    const prompt = `Act as an expert developer AI analyst. You are analyzing the GitHub repository ${owner}/${repo} (${repoData.description || 'No description'}).
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
      // @ts-ignore
      const ollimaKey = typeof import.meta !== 'undefined' ? import.meta.env.OLLIMA_API_KEY : process.env.OLLIMA_API_KEY;
      
      if (ollimaKey) {
        // Using standard OpenAI compatible endpoint for Ollima API
        const res = await fetch("https://api.ollima.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ollimaKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          const content = data.choices[0].message.content;
          // Clean up potential markdown formatting in JSON response
          const jsonStr = content.replace(/^```json\n/, '').replace(/\n```$/, '');
          const parsed = JSON.parse(jsonStr);
          return {
            summary: parsed.summary || "",
            whyTrending: parsed.whyTrending || "",
            difficulty: parsed.difficulty || "",
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
            useCases: Array.isArray(parsed.useCases) ? parsed.useCases : [],
            alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : [],
          };
        } else {
          const text = await res.text();
          console.error("[Ollima] API error:", res.status, text);
          throw new Error("Ollima API error");
        }
      } else {
        throw new Error("OLLIMA_API_KEY not found");
      }
    } catch (e) {
      console.log("[Ollima] Intelligence generation failed, using unavailable status...", e);
      // Fallback response so the page does not crash
      return {
        summary: "AI intelligence temporarily unavailable",
        whyTrending: "AI intelligence temporarily unavailable",
        difficulty: "AI intelligence temporarily unavailable",
        strengths: [],
        limitations: [],
        useCases: [],
        alternatives: []
      };
    }
  }
}

export const ollima = new OllimaService();
