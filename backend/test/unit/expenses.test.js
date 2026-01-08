import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Expenses API", () => {
  it("GET /api/expenses returns a list", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/expenses returns 400 if fields are missing", async () => {
    const res = await request(app).post("/api/expenses").send({ label: "Coffee" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/expenses creates an expense", async () => {
    const res = await request(app).post("/api/expenses").send({
      label: "Coffee",
      amount: 3.5,
      categoryId: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("label");
    expect(res.body).toHaveProperty("amount");
    expect(res.body).toHaveProperty("categoryId");
  });
});
