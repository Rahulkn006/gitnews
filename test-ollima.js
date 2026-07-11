import fs from "fs";
import fetch from "node-fetch";

const companies = [
  "openai",
  "anthropic",
  "huggingface",
  "mistralai",
  "microsoft",
  "google",
  "meta",
  "amazon",
  "apple",
  "netflix",
  "uber",
  "airbnb",
  "shopify",
  "github",
  "docker",
  "vercel",
  "supabase",
  "mongodb",
  "postmanlabs",
  "jetbrains",
  "hashicorp",
  "cloudflare",
  "nvidia",
  "intel",
  "amd",
];

async function getScores() {
  const prompt = `Act as an expert engineering analyst. I have a list of elite tech companies. For each company, provide a realistic "Engineering Score" out of 100 based on their real-world open-source contributions, engineering culture, and technical impact.
  
Return ONLY a valid JSON object mapping the company key to the score (integer).
Example:
{
  "microsoft": 98,
  "google": 99
}

Here are the companies: ${companies.join(", ")}`;

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        format: "json",
        stream: false,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("OLLIMA SCORES:");
      console.log(data.response);
      fs.writeFileSync("scores.json", data.response);
    } else {
      console.log("Error:", await res.text());
    }
  } catch (e) {
    console.log("Failed to fetch:", e);
  }
}

getScores();
