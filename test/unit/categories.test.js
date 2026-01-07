import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Budget Categories API", () => {
  it("GET /api/categories returns a list", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/categories creates a category", async () => {
    const res = await request(app).post("/api/categories").send({ name: "Transport" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Transport");
  });

  it("POST /api/categories returns 400 if name is missing", async () => {
    const res = await request(app).post("/api/categories").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/categories returns 409 if category already exists", async () => {
    await request(app).post("/api/categories").send({ name: "School" });
    const res = await request(app).post("/api/categories").send({ name: "School" });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("DELETE /api/categories/:id returns 404 if category does not exist", async () => {
    const res = await request(app).delete("/api/categories/999999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
