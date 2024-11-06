import { NextFunction, Request, Response } from "express";
import client from "prom-client";

// Create a Counter metric for total request counts
const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Create a Histogram metric for tracking request duration
const requestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route"],
});

// Create a Gauge metric for tracking active requests
const activeRequests = new client.Gauge({
  name: "http_active_requests",
  help: "Current number of active HTTP requests",
});

// Middleware function
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    requestDuration.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path || "unknown_route",
      },
      duration
    );
  });

  next();
};
