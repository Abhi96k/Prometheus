import express, { Request, Response, NextFunction } from "express";
import client from "prom-client";
import { metricsMiddleware } from "./monitoring/requestCount";
import { gaugeMiddleware } from "./monitoring/gaugeMiddleware";
import { histogramMiddleware } from "./monitoring/histogramMiddleware";

const app = express();

// Use JSON middleware to parse JSON requests
app.use(express.json());

// Use metrics middleware for request counting (Counter)
app.use(metricsMiddleware);

// Use gauge middleware to track active requests (Gauge)
app.use(gaugeMiddleware);

// Use histogram middleware to track request duration (Histogram)
app.use(histogramMiddleware);

// Sample API route to test the setup
app.get("/api/user", (req: Request, res: Response) => {
  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.post("/api/user", (req: Request, res: Response) => {
  const user = req.body;
  res.send({
    ...user,
    id: 1,
  });
});

// Metrics endpoint for Prometheus to scrape
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send({ error: "Route not found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
