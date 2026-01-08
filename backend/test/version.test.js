import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /api/version", function () {
  it("returns package version as a non-empty string", async function () {
    const res = await request(app).get("/api/version");

    expect(res.status).toBe(200);
    expect(typeof res.body.version).toBe("string");
    expect(res.body.version.length).toBeGreaterThan(0);
  });

  it("responds with JSON content-type", async function () {
    const res = await request(app).get("/api/version");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
