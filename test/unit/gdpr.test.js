/**
 *  tests for GDPR routes 
 */

import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("GDPR API", () => {
  it("GET /api/gdpr/info returns GDPR information", async () => {
    const res = await request(app).get("/api/gdpr/info");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("dataCollected");
    expect(res.body).toHaveProperty("purpose");
    expect(res.body).toHaveProperty("storage");
    expect(res.body).toHaveProperty("retention");

    expect(Array.isArray(res.body.dataCollected)).toBe(true);
    expect(typeof res.body.purpose).toBe("string");
  });

  it("GET /api/gdpr/user/1 returns user data", async () => {
    const res = await request(app).get("/api/gdpr/user/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("consent");

    expect(res.body.id).toBe(1);
  });

  it("GET /api/gdpr/user/999999 returns 404 if user does not exist", async () => {
    const res = await request(app).get("/api/gdpr/user/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /api/gdpr/consent/1 returns consent status", async () => {
    const res = await request(app).get("/api/gdpr/consent/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("consent");

    expect(res.body.id).toBe(1);
    expect(typeof res.body.consent).toBe("boolean");
  });

  it("DELETE /api/gdpr/user/2 deletes user data", async () => {
    // delete the user 2 
    const res = await request(app).delete("/api/gdpr/user/2");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    //check that user 2 is gone
    const check = await request(app).get("/api/gdpr/user/2");
    expect(check.status).toBe(404);
  });

  it("DELETE /api/gdpr/user/999999 returns 404 if user does not exist", async () => {
    const res = await request(app).delete("/api/gdpr/user/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
