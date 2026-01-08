/**
 *  tests for the incomes 
 */

import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Incomes API", () => {

  // GET all the incomes
  it("GET /api/incomes returns a list", async () => {
    const res = await request(app).get("/api/incomes");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // POST income with missing fields
  it("POST /api/incomes returns 400 if fields are missing", async () => {
    const res = await request(app)
      .post("/api/incomes")
      .send({ label: "Scholarship" }); 

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // POST a valid income
  it("POST /api/incomes creates a new income", async () => {
    const res = await request(app)
      .post("/api/incomes")
      .send({
        label: "Scholarship",
        amount: 500,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.label).toBe("Scholarship");
    expect(res.body.amount).toBe(500);
  });

  // delete income
  it("DELETE /api/incomes/:id deletes an income", async () => {
    // create income first
    const createRes = await request(app)
      .post("/api/incomes")
      .send({
        label: "Temporary income",
        amount: 100,
      });

    const incomeId = createRes.body.id;

    // delete it
    const deleteRes = await request(app)
      .delete("/api/incomes/" + incomeId);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty("message");
  });

  // delete income that doesn't exist
  it("DELETE /api/incomes/:id returns 404 if income does not exist", async () => {
    const res = await request(app)
      .delete("/api/incomes/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

});
