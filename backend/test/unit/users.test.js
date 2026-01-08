import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Users API", () => {
  it("GET /api/users returns a list", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/users creates a new user when fields are valid", async () => {
    const userData = {
      username: "TestUser",
      email: "test@example.com",
      password: "123456",
    };

    const res = await request(app).post("/api/users").send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe("TestUser");
    expect(res.body.email).toBe("test@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  it("POST /api/users returns 400 when required fields are missing", async () => {
    const invalidUser = { username: "OnlyName" };

    const res = await request(app).post("/api/users").send(invalidUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
