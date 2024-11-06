"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Create a Counter metric for total request counts
const requestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});
// Create a Histogram metric for tracking request duration
const requestDuration = new prom_client_1.default.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route"],
});
// Create a Gauge metric for tracking active requests
const activeRequests = new prom_client_1.default.Gauge({
    name: "http_active_requests",
    help: "Current number of active HTTP requests",
});
// Middleware function
const metricsMiddleware = (req, res, next) => {
    // Start time for duration tracking
    const startTime = Date.now();
    // Increment active requests gauge
    activeRequests.inc();
    res.on("finish", () => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // Convert ms to seconds
        console.log(`Request to ${req.path} took ${duration}s`);
        // Decrement active requests gauge
        activeRequests.dec();
        // Increment request counter with method, route, and status code labels
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path || "unknown_route",
            status_code: res.statusCode,
        });
        // Observe request duration in histogram
        requestDuration.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path || "unknown_route",
        }, duration);
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
