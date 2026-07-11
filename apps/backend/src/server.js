"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const repositories_routes_1 = __importDefault(require("./routes/repositories.routes"));
const companies_routes_1 = __importDefault(require("./routes/companies.routes"));
const battle_routes_1 = __importDefault(require("./routes/battle.routes"));
const market_routes_1 = __importDefault(require("./routes/market.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const githubSync_1 = require("./scheduler/githubSync");
const github_service_1 = require("./services/github.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/repositories", repositories_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/companies", companies_routes_1.default);
app.use("/api/battle", battle_routes_1.default);
app.use("/api/market", market_routes_1.default);
app.use("/api/news", news_routes_1.default);
app.post("/api/sync/github", async (req, res) => {
    try {
        // Run sync in background
        github_service_1.GitHubService.syncGitHubData().catch(console.error);
        res.json({ message: "GitHub Sync started" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to start sync" });
    }
});
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
(0, githubSync_1.startScheduler)();
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map