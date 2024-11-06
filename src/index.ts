import express, { Request, Response, NextFunction } from "express";
import client from "prom-client";
import { histogramMiddleware } from "./monitoring/histogramMiddleware";

const app = express();

// Use JSON middleware
app.use(express.json());

// Use histogram middleware to track request durations
app.use(histogramMiddleware);

// Define routes
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

// Endpoint for Prometheus to scrape metrics
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Handle undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send({ error: "Route not found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
