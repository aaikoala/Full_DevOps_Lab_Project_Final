import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import { connectToDb } from "../src/db/mongo.js";

describe.sequential("API Transactions (Integration)", () => { // the tests are run sequentially to avoid the database conflicts
    // Connect to the database
  beforeAll(async () => {
    await connectToDb();
  }, 30000);

  beforeEach(async () => {
    await User.deleteMany({});
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a user (POST)", async () => {
    // create a user
    const res = await request(app).post("/api/users").send({
      username: "testuser",
      email: "testuser@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe("testuser");
    expect(res.body.email).toBe("testuser@test.com");
  }, 30000);

  it("should get all users (GET)", async () => {
    // Create a user in the database
    await User.create({
      username: "alice",
      email: "alice@test.com",
      password: "123456",
    });

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe("alice");
  }, 30000);

  it("should delete a user (DELETE)", async () => {
    // Create a user to delete
    const user = await User.create({
      username: "todelete",
      email: "delete@test.com",
      password: "123456",
    });

    const id = user._id.toString();

    const res = await request(app).delete("/api/users/" + id);
    expect(res.statusCode).toBe(204);

    const check = await User.findById(id);
    expect(check).toBeNull();
  }, 30000);
});
