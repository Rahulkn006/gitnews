"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
class MarketService {
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
exports.MarketService = MarketService;
//# sourceMappingURL=market.service.js.map