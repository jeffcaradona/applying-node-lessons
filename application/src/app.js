/**
 * Load environment variables from .env file.
 */
import { configDotenv } from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";

//  Explicitly create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Restrict HTTP methods
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    next(createError(405, "Method Not Allowed"));
  } else {
    next();
  }
});

app.get("/", (req, res, next) => {
  next(createError(501, "Not Implemented"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
