"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        // Return mock news or fetch from DB
        res.json([
            { id: "1", title: "GitNews migrating to REST API", content: "The transition from Convex to a standard Node backend is complete.", createdAt: new Date().toISOString() }
        ]);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch news" });
    }
});
exports.default = router;
//# sourceMappingURL=news.routes.js.map