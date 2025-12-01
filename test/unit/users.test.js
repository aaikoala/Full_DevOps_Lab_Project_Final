/**
 * Integration tests for user registration
 * We verify that GET /register works and POST /register creates an user
 */

import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("User Registration API", () => {
  
  //  GET /register : message
  it("GET /register returns a welcome message", async () => {
    const res = await request(app).get("/register");
    

    expect(res.status).toBe(200);

    // response must contain a message field
    expect(typeof res.body.message).toBe("string");
  });

  // POST /register should create a new user
  it("POST /register creates a new user when fields are valid", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "123456"
    };

    const res = await request(app)
      .post("/register")
      .send(userData);

    // route should return 201 = created
    expect(res.status).toBe(201);

    // new user must have an id
    expect(res.body).toHaveProperty("id");

    // returned name should match what we sent
    expect(res.body.name).toBe(userData.name);
  });

  // POST /register with missing fields should return 400
  it("POST /register returns 400 when required fields are missing", async () => {
    const invalidUser = {
      name: "Only Name",
      // missing email and password
    };

    const res = await request(app)
      .post("/register")
      .send(invalidUser);

    // expect an error 
    expect(res.status).toBe(400);

    // API must return an error message
    expect(res.body).toHaveProperty("error");
  });
});
