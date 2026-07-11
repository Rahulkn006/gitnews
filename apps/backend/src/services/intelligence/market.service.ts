export class MarketService {
  static async getMarketSignals() {
    return [
      {
        type: "technology_trend",
        name: "Rust Adoption",
        score: 95.5,
        metadata: JSON.stringify({ category: "Systems Programming" })
      },
      {
        type: "ai_market_movement",
        name: "Local LLMs",
        score: 98.2,
        metadata: JSON.stringify({ category: "AI Models" })
      }
    ];
  }
}
