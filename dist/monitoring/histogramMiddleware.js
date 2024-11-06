"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.histogramMiddleware = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Create a Histogram metric to track request duration
const requestDurationHistogram = new prom_client_1.default.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    // Define buckets for request duration (in seconds)
    buckets: [0.1, 0.5, 1, 2.5, 5, 10],
});
// Middleware to measure request duration
const histogramMiddleware = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTime) / 1000; // Convert ms to seconds
        console.log(`Request to ${req.path} took ${durationInSeconds}s`);
        // Observe request duration in the histogram with labels
        requestDurationHistogram.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path || "unknown_route",
            status_code: res.statusCode.toString(),
        }, durationInSeconds);
    });
    next();
};
exports.histogramMiddleware = histogramMiddleware;
