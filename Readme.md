<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>README.md</title>
</head>
<body>

  <h1>Express Application with Prometheus Monitoring</h1>

  <p>This project demonstrates an Express application using <code>prom-client</code> to integrate Prometheus monitoring. It includes middleware for tracking key metrics like request counts, active requests, and request duration.</p>

  <h2>Overview</h2>
  <p>This application provides three types of Prometheus metrics:</p>
  <ul>
    <li><strong>Counter</strong>: Tracks total HTTP requests.</li>
    <li><strong>Gauge</strong>: Tracks active HTTP requests.</li>
    <li><strong>Histogram</strong>: Measures the duration of each HTTP request.</li>
  </ul>

  <h2>Project Setup</h2>
  <pre><code>npm install
npm start</code></pre>
  <p>This command installs dependencies and starts the Express server on <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</p>

  <h2>Metrics Types</h2>
  <p>Prometheus supports multiple types of metrics. Here’s how we use them in this project:</p>

  <h3>1. Counter</h3>
  <p>A counter is a cumulative metric that only increases. It resets when the application restarts.</p>
  <p><strong>Example:</strong> Counting the total number of HTTP requests received.</p>
  <pre><code>const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});</code></pre>

  <h3>2. Gauge</h3>
  <p>A gauge metric measures values that fluctuate, such as the number of active users or memory usage. It can increase and decrease over time.</p>
  <p><strong>Example:</strong> Measuring the current number of active HTTP requests.</p>
  <pre><code>const activeRequests = new client.Gauge({
  name: "http_active_requests",
  help: "Current number of active HTTP requests",
});</code></pre>

  <h3>3. Histogram</h3>
  <p>A histogram samples observations (like request durations) and counts them into buckets. It also provides the total sum of observed values.</p>
  <p><strong>Example:</strong> Measuring the duration of HTTP requests.</p>
  <pre><code>const requestDurationHistogram = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10],
});</code></pre>

  <h2>Middleware Setup</h2>
  <p>The <code>metricsMiddleware</code> file contains the middleware configuration for all three metrics. This middleware:</p>
  <ul>
    <li>Increments the <strong>Counter</strong> with labels for HTTP method, route, and status code.</li>
    <li>Increments the <strong>Gauge</strong> at the start of each request and decrements it after the request finishes.</li>
    <li>Observes request durations with the <strong>Histogram</strong> by calculating time from request start to finish.</li>
  </ul>

  <h2>Metrics Endpoint</h2>
  <p>The application exposes a <code>/metrics</code> endpoint, which Prometheus scrapes to collect metrics data.</p>
  <pre><code>app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});</code></pre>
  <p>Prometheus should be configured to scrape <code>http://localhost:3000/metrics</code> to retrieve the metrics.</p>

  <h2>Example Usage</h2>
  <p>The app provides a few example routes:</p>
  <ul>
    <li><code>GET /api/user</code>: Returns a sample user object.</li>
    <li><code>POST /api/user</code>: Receives a user object and returns it with an assigned ID.</li>
  </ul>

  <h2>Running Prometheus with the App</h2>
  <p>To monitor this application with Prometheus:</p>
  <ol>
    <li>Install Prometheus by following the instructions on the <a href="https://prometheus.io/download/" target="_blank">Prometheus download page</a>.</li>
    <li>Create a <code>prometheus.yml</code> configuration file with the following content:</li>
  </ol>
  <pre><code>global:
  scrape_interval: 15s

scrape_configs:

- job_name: "express_app"
  metrics_path: "/metrics"
  static_configs:

  - targets: ["localhost:3000"]</code></pre>

  <ol start="3">
    <li>Start Prometheus using <code>./prometheus --config.file=prometheus.yml</code>.</li>
    <li>Visit <a href="http://localhost:9090" target="_blank">http://localhost:9090</a> to see metrics data and configure alerts or visualizations.</li>
  </ol>

  <h2>Conclusion</h2>
  <p>This application serves as a foundation for monitoring Express applications with Prometheus, covering essential metrics types: Counter, Gauge, and Histogram. These metrics provide insights into application performance and help track resource usage over time.</p>

  <h2>License</h2>
  <p>MIT License</p>

</body>
</html>
