/**
 * performance and speed
 * - adds a response time header
 * - adds a very simple cache
 */

import { Router } from "express";

const router = Router();

// ------------------------------
// response time header
// ------------------------------
router.use(function (req, res, next) {
  var startTime = Date.now();

  // Put the header before sending the response
  res.on("header", function () {});
  // Better: set header right before response is finished (but BEFORE it is sent)
  // We do it by wrapping res.writeHead
  var originalWriteHead = res.writeHead;

  res.writeHead = function () {
    var duration = Date.now() - startTime;
    res.setHeader("X-Response-Time", duration + "ms");
    return originalWriteHead.apply(res, arguments);
  };

  next();
});

// ------------------------------
// very simple cache (GET only)
// ------------------------------
var cache = {}; // key -> { expiresAt, status, body, contentType }
var stats = {
  hits: 0,
  misses: 0,
  clears: 0,
};

var CACHE_DURATION = 10000; // 10 seconds

function simpleCache(req, res, next) {
  // only cache GET requests
  if (req.method !== "GET") {
    next();
    return;
  }

  const key = req.originalUrl;
  const cachedItem = cache[key];

  // if cache exists and not expired
  if (cachedItem) {
    if (Date.now() < cachedItem.expiresAt) {
      stats.hits = stats.hits + 1;

      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", cachedItem.contentType);

      res.status(200).send(cachedItem.body);
      return;
    }
  }

  // cache MISS
  stats.misses = stats.misses + 1;
  res.setHeader("X-Cache", "MISS");

  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  // intercept res.send
  res.send = function (body) {
    if (res.statusCode === 200) {
      cache[key] = {
        body: body,
        contentType: res.getHeader("Content-Type"),
        expiresAt: Date.now() + CACHE_DURATION,
      };
    }
    return originalSend(body);
  };

  // intercept res.json
  res.json = function (data) {
    if (res.statusCode === 200) {
      cache[key] = {
        body: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        expiresAt: Date.now() + CACHE_DURATION,
      };
    }
    return originalJson(data);
  };

  next();
}

// Apply cache to ALL /api/perf routes
router.use("/api/perf", simpleCache);

// ------------------------------
// routes
// ------------------------------
router.get("/api/perf/stats", function (req, res) {
  res.status(200).json({
    cacheSize: Object.keys(cache).length,
    stats: stats,
  });
});

router.post("/api/perf/clear-cache", function (req, res) {
  var k;
  for (k in cache) {
    delete cache[k];
  }

  stats.clears = stats.clears + 1;

  res.status(200).json({ message: "Cache cleared" });
});

/**
 * This route is ONLY to test caching easily.
 * It always returns 200 and JSON, so cache can HIT on second call.
 */
router.get("/api/perf/ping", function (req, res) {
  res.status(200).json({ ok: true, message: "pong" });
});

export default router;
