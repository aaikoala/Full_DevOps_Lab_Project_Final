/**
 * Integration test for GET /api/boom.
 * Ensures global error handler shapes the response.
 */

import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /api/boom", () => {
  it("returns 500 with error payload", async () => {
    const res = await request(app).get("/api/boom");
    // Check that the HTTP status code is 500
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();  // check that the response contains an error field
  });
});