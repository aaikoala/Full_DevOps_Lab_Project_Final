/**
 * tests for performance and speed routes
 */

import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Performance API", function () {
  it("GET /api/perf/stats returns stats", async function () {
    const res = await request(app).get("/api/perf/stats");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("cacheSize");
    expect(res.body).toHaveProperty("stats");
    expect(res.body.stats).toHaveProperty("hits");
    expect(res.body.stats).toHaveProperty("misses");
    expect(res.body.stats).toHaveProperty("clears");
  });

  it("Cache works: second request is a HIT", async function () {
    // clear cache first
    await request(app).post("/api/perf/clear-cache");

    // first call -> MISS
    const first = await request(app).get("/api/perf/ping");
    expect(first.status).toBe(200);
    expect(first.headers["x-cache"]).toBe("MISS");

    // second call -> HIT
    const second = await request(app).get("/api/perf/ping");
    expect(second.status).toBe(200);
    expect(second.headers["x-cache"]).toBe("HIT");
  });

  it("POST /api/perf/clear-cache clears the cache", async function () {
    // create cache
    await request(app).get("/api/perf/ping");

    // clear cache
    const res = await request(app).post("/api/perf/clear-cache");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    // now cache should be empty again (at least for /api/perf/ping)
    const statsRes = await request(app).get("/api/perf/stats");
    expect(statsRes.status).toBe(200);
  });

  it("X-Response-Time header exists", async function () {
    const res = await request(app).get("/api/perf/stats");
    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty("x-response-time");
  });
});
