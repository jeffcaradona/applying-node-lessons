// app.mjs
import express from "express";
import { eventLoopHeaders, metricsHandler, stopMetrics } from "./metrics.mjs";

const app = express();

// Lightweight visibility on every response
app.use(eventLoopHeaders());

// Example route to prove headers show up
app.get("/hello", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Prometheus scrape endpoint
app.get("/metrics", metricsHandler);

// Optional: a synthetic “load” route to test lag behavior
app.get("/burn", (_req, res) => {
  const end = Date.now() + 500; // ~500ms busy loop (don’t do this in real apps)
  while (Date.now() < end) {
    console.info(`HOT PATH!`); // eslint-disable-line no-console
  }
  res.send("hot path done");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`HTTP listening on http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received, shutting down...`);
  stopMetrics();
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
