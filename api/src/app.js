import express from "express";
import createError from "http-errors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
  eventLoopHeaders,
  metricsHandler,
} from "./modules/metrics.mjs";


const app = express();

// Security middleware
app.use(helmet());
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Add event loop metrics headers to every response
app.use(eventLoopHeaders());

// Add Prometheus metrics endpoint
app.get("/metrics", metricsHandler);

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Restrict HTTP methods
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!allowedMethods.includes(req.method)) {
    next(createError(405, "Method Not Allowed"));
  } else {
    next();
  }
});


import { router } from "./routers/router.js";
// Routing
app.use("/api", router);

app.get("/", (req, res, next) => {
  next(createError(501, "Not Implemented"));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((error, req, res, next) => {
  const message = req.app.get("env") === "development" ? error.message : "";
  res.status(error.status || 500).json({ message: message });
});

export default app;
