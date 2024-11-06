import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const requestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route"],
});

export const requestCountMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Simulate delay (e.g., 200 ms)
  setTimeout(() => {
    res.on("finish", () => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // Convert to seconds

      console.log(`Request to ${req.path} took ${duration}s`);

      // Increment request counter with labels for method, route, and status code
      requestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path || "unknown_route",
        status_code: res.statusCode,
      });

      // Observe duration in the histogram
      requestDuration.observe(
        {
          method: req.method,
          route: req.route ? req.route.path : req.path || "unknown_route",
        },
        duration
      );
    });

    next();
  }, 200); // 200 ms delay for demonstration
};
