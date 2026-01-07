import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /version", () => {
  it("returns package version", async () => {
    const res = await request(app).get("/version");

    expect(res.status).toBe(200);
    expect(typeof res.body.version).toBe("string");
    expect(res.body.version.length).toBeGreaterThan(0);
  });

  it("returns JSON", async () => {
    const res = await request(app).get("/version");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");
  });
});
