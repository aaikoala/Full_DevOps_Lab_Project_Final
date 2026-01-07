/**
 * tests for budget categories 
 */

import request from "supertest";
import app from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("Budget Categories API", () => {
  it("GET /api/categories returns a list of categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/categories creates a new category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send({ name: "Transport" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Transport");
  });

  it("POST /api/categories returns 400 if name is missing", async () => {
    const res = await request(app).post("/api/categories").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/expenses returns 400 if categoryId does not exist", async () => {
    const res = await request(app).post("/api/expenses").send({
      label: "Coffee",
      amount: 3.5,
      categoryId: 999, 
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/expenses creates a new expense linked to a category", async () => {
    // create a category first
    const categoryRes = await request(app)
      .post("/api/categories")
      .send({ name: "School" });

    expect(categoryRes.status).toBe(201);

    const categoryId = categoryRes.body.id;

    const res = await request(app).post("/api/expenses").send({
      label: "Notebook",
      amount: 5,
      categoryId: categoryId,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.categoryId).toBe(categoryId);
  });

  it("DELETE /api/categories/:id deletes a category", async () => {
    // create a category to delete
    const categoryRes = await request(app)
      .post("/api/categories")
      .send({ name: "Temp" });

    const idToDelete = categoryRes.body.id;

    const res = await request(app).delete("/api/categories/" + idToDelete);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("deletedCategory");
  });

  it("DELETE /api/categories/:id unlinks expenses", async () => {
    // create a category
    const categoryRes = await request(app)
      .post("/api/categories")
      .send({ name: "Food2" });

    const categoryId = categoryRes.body.id;

    // create an expense linked to it
    const expenseRes = await request(app).post("/api/expenses").send({
      label: "Burger",
      amount: 10,
      categoryId: categoryId,
    });

    expect(expenseRes.status).toBe(201);

    // delete the category
    const deleteRes = await request(app).delete("/api/categories/" + categoryId);
    expect(deleteRes.status).toBe(200); 

    // check the expenses : the expense should now have categoryId = null
    const allExpenses = await request(app).get("/api/expenses");
    expect(allExpenses.status).toBe(200);

    let foundExpense = null;

    for (let i = 0; i < allExpenses.body.length; i++) {
        if (allExpenses.body[i].id === expenseRes.body.id) {
            foundExpense = allExpenses.body[i];
        }
    }

    // check that the expense exists
    expect(foundExpense).not.toBe(null);

    // check that the categoryId was removed
    expect(foundExpense.categoryId).toBe(null);});
});
