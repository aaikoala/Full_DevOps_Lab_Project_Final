import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Transaction from "../src/models/transaction.model.js";
import { connectToDb } from "../src/db/mongo.js";

describe("API Transactions (Integration)", () => {
  
  beforeAll(async () => {
    await connectToDb();
  }, 30000); 

  beforeEach(async () => {
    await Transaction.deleteMany({});
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("devrait créer une transaction (POST)", async () => {
    const res = await request(app)
      .post("/api/transaction")
      .send({
        titre: "Test Burger",
        montant: 10,
        type: "depense",
        categorie: "Nourriture"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.titre).toBe("Test Burger");
    expect(res.body).toHaveProperty("_id"); 
  }, 30000);

  it("devrait récupérer toutes les transactions (GET)", async () => {
    await Transaction.create({ titre: "Salaire", montant: 2000, type: "revenu" });

    const res = await request(app).get("/api/transaction");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titre).toBe("Salaire");
  }, 30000);

  it("devrait supprimer une transaction (DELETE)", async () => {
    const t = await Transaction.create({ titre: "A supprimer", montant: 5, type: "depense" });
    const id = t._id.toString(); 

    const res = await request(app).delete(`/api/transaction/${id}`);
    expect(res.statusCode).toBe(204);

    const verif = await Transaction.findById(id);
    expect(verif).toBeNull();
  }, 30000);
});