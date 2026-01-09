/**
 * Integration test for GET /api/info.
 * Validates the merged info object from helpers.
 */
import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /api/info", () => {
  it("returns app info", async () => {
    // send GET request to /api/info
    const res = await request(app).get("/api/info");
    // Check HTTP status
    expect(res.status).toBe(200);
    //check the fields and their types
    expect(typeof res.body.name).toBe("string");
    expect(typeof res.body.version).toBe("string");
    expect(typeof res.body.node).toBe("string");
    expect(typeof res.body.uptime).toBe("number");
  });

  it("has plausible node version & non-negative uptime", async () => {
    const res = await request(app).get("/api/info");
    
    expect(res.body.node).toMatch(/^v\d+\.\d+\.\d+/);
    expect(res.body.uptime).toBeGreaterThanOrEqual(0); // the uptime is never be negative
  });
});