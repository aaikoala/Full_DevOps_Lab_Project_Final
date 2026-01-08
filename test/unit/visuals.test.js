/**
 *  tests for visuals (dashboard charts)
 */

import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Visuals API", () => {
  it("GET /api/visuals/summary returns totals and balance", async () => {
    const res = await request(app).get("/api/visuals/summary");

    // Check HTTP status
    expect(res.status).toBe(200);

    // Check json structure
    expect(res.body).toHaveProperty("totalIncome");
    expect(res.body).toHaveProperty("totalExpense");
    expect(res.body).toHaveProperty("balance");

    expect(typeof res.body.totalIncome).toBe("number");
    expect(typeof res.body.totalExpense).toBe("number");
    expect(typeof res.body.balance).toBe("number");
  });

  it("GET /api/visuals/expenses-by-category returns an array", async () => {
    const res = await request(app).get("/api/visuals/expenses-by-category");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    //if there is at least one element, we check its structure
    if (res.body.length > 0) {
      const first = res.body[0];
      expect(first).toHaveProperty("category");
      expect(first).toHaveProperty("total");
      expect(typeof first.category).toBe("string");
      expect(typeof first.total).toBe("number");
    }
  });

  it("GET /api/visuals/incomes-by-source returns an array", async () => {
    const res = await request(app).get("/api/visuals/incomes-by-source");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // if there is at least one element, we check its structure
    if (res.body.length > 0) {
      const first = res.body[0];
      expect(first).toHaveProperty("source");
      expect(first).toHaveProperty("total");
      expect(typeof first.source).toBe("string");
      expect(typeof first.total).toBe("number");
    }
  });

  it("GET /api/visuals/cashflow-by-month returns an array of month objects", async () => {
    const res = await request(app).get("/api/visuals/cashflow-by-month");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const first = res.body[0];

      expect(first).toHaveProperty("month");
      expect(first).toHaveProperty("income");
      expect(first).toHaveProperty("expense");
      expect(typeof first.month).toBe("string");
      expect(typeof first.income).toBe("number");
      expect(typeof first.expense).toBe("number");
    }
  });
});
