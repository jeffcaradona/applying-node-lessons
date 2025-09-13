// metrics.mjs
import * as perf from "node:perf_hooks";
import { Registry, collectDefaultMetrics, Histogram, Gauge } from "prom-client";

const { monitorEventLoopDelay, eventLoopUtilization: eluFn } = perf;

const REGISTRY = new Registry();
collectDefaultMetrics({ register: REGISTRY });

// High-res event loop delay (ns)
const eld = monitorEventLoopDelay({ resolution: 20 });
eld.enable();

// ELU state (may be undefined on some builds)
let lastELU = typeof eluFn === "function" ? eluFn() : null;

const eldHistogram = new Histogram({
  name: "nodejs_event_loop_lag_seconds",
  help: "Event loop lag observed via monitorEventLoopDelay",
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [REGISTRY],
});

const eldMin = new Gauge({
  name: "nodejs_event_loop_lag_min_seconds",
  help: "Min lag",
  registers: [REGISTRY],
});
const eldMax = new Gauge({
  name: "nodejs_event_loop_lag_max_seconds",
  help: "Max lag",
  registers: [REGISTRY],
});
const eldMean = new Gauge({
  name: "nodejs_event_loop_lag_mean_seconds",
  help: "Mean lag",
  registers: [REGISTRY],
});
const eldStddev = new Gauge({
  name: "nodejs_event_loop_lag_stddev_seconds",
  help: "Stddev lag",
  registers: [REGISTRY],
});

const eluGauge = new Gauge({
  name: "nodejs_event_loop_utilization",
  help: "Event loop utilization (0..1) since last sample",
  registers: [REGISTRY],
});

const SAMPLE_MS = 1000;
const LAG_ALERT_THRESHOLD_MS = 100;

const timer = setInterval(() => {
  const toSec = (ns) => Number(ns) / 1e9;

  eldHistogram.observe(toSec(eld.mean));
  eldMin.set(toSec(eld.min));
  eldMax.set(toSec(eld.max));
  eldMean.set(toSec(eld.mean));
  eldStddev.set(toSec(eld.stddev));

  if (typeof eluFn === "function") {
    const cur = eluFn();
    const delta = lastELU ? eluFn(lastELU, cur) : cur;
    lastELU = cur;
    const util = Number(delta?.utilization ?? 0);
    if (Number.isFinite(util)) eluGauge.set(util);
  }

  const lagMs = eld.mean / 1e6;
  if (lagMs > LAG_ALERT_THRESHOLD_MS) {
    // eslint-disable-next-line no-console
    console.warn(
      `[lag] mean=${lagMs.toFixed(1)}ms max=${(eld.max / 1e6).toFixed(
        1
      )}ms util=${(eluGauge.hashMap?.[""]?.value ?? 0).toFixed(2)}`
    );
  }

  eld.reset();
}, SAMPLE_MS);
timer.unref();

export function eventLoopHeaders() {
  return (_req, res, next) => {
    res.setHeader("X-Event-Loop-Lag-Mean-ms", (eld.mean / 1e6).toFixed(2));
    res.setHeader("X-Event-Loop-Lag-Max-ms", (eld.max / 1e6).toFixed(2));
    const util = eluGauge.hashMap?.[""]?.value;
    res.setHeader(
      "X-Event-Loop-Utilization",
      Number.isFinite(util) ? util.toFixed(3) : "na"
    );
    next();
  };
}

export async function metricsHandler(_req, res) {
  res.setHeader("Content-Type", REGISTRY.contentType);
  res.end(await REGISTRY.metrics());
}

export function stopMetrics() {
  clearInterval(timer);
  eld.disable();
}

export { REGISTRY };
