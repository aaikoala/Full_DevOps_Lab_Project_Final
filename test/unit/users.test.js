import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("User Registration API", () => {

  it("GET /api/register returns a welcome message", async () => {
    const res = await request(app).get("/api/register");

    expect(res.status).toBe(200);
    expect(typeof res.body.message).toBe("string");
  });

  it("POST /api/register creates a new user when fields are valid", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "123456"
    };

    const res = await request(app)
      .post("/api/register")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(userData.name);
  });

  it("POST /api/register returns 400 when required fields are missing", async () => {
    const invalidUser = { name: "Only Name" }; 

    const res = await request(app)
      .post("/api/register")
      .send(invalidUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
