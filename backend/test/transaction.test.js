import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Transaction from "../src/models/transaction.model.js";
import { connectToDb } from "../src/db/mongo.js";

describe("API Transactions (Integration)", () => {
  // Connect to the database
  beforeAll(async () => {
    await connectToDb();
  }, 30000);
  // clean the transactions
  beforeEach(async () => {
    await Transaction.deleteMany({});
  }, 30000);
  //Close the database connection
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a transaction (POST)", async () => {
    const res = await request(app).post("/api/transaction").send({
      titre: "Test Burger",
      montant: 10,
      type: "depense",
      categorie: "Nourriture",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.titre).toBe("Test Burger");
    expect(res.body).toHaveProperty("_id");
  }, 30000);

  it("should get all transactions (GET)", async () => {
    // insert a transaction in the database
    await Transaction.create({ titre: "Salaire", montant: 2000, type: "revenu" });

    const res = await request(app).get("/api/transaction");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titre).toBe("Salaire");
  }, 30000);

  it("should delete a transaction (DELETE)", async () => {
    const t = await Transaction.create({ titre: "To delete", montant: 5, type: "depense" }); //create a transaction to delete
    const id = t._id.toString();

    const res = await request(app).delete("/api/transaction/" + id);
    expect(res.statusCode).toBe(204);
    // Check that the transaction is removed from the database
    const check = await Transaction.findById(id);
    expect(check).toBeNull();
  }, 30000);
});
