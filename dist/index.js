"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const histogramMiddleware_1 = require("./monitoring/histogramMiddleware");
const app = (0, express_1.default)();
// Use JSON middleware
app.use(express_1.default.json());
// Use histogram middleware to track request durations
app.use(histogramMiddleware_1.histogramMiddleware);
// Define routes
app.get("/api/user", (req, res) => {
    res.send({
        name: "John Doe",
        age: 25,
    });
});
app.post("/api/user", (req, res) => {
    const user = req.body;
    res.send(Object.assign(Object.assign({}, user), { id: 1 }));
});
// Endpoint for Prometheus to scrape metrics
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.set("Content-Type", prom_client_1.default.register.contentType);
    res.end(yield prom_client_1.default.register.metrics());
}));
// Handle undefined routes
app.use((req, res) => {
    res.status(404).send({ error: "Route not found" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});
// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
