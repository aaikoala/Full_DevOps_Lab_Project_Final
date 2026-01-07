import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import transactionsRoutes from "../src/routes/auto/transaction.route.js"; 

const app = express();
app.use(express.json());
app.use("/api/transactions", transactionsRoutes);

describe("Transactions API", () => {

  it("GET /api/transactions should return an array", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/transactions should add a new EXPENSE", async () => {
    const nouvelleDepense = {
      titre: "Cours en ligne",
      montant: 30,
      type: "depense",
      categorie: "éducation",
      date: "2025-11-25"
    };

    const res = await request(app)
      .post("/api/transactions")
      .send(nouvelleDepense);

    expect(res.status).toBe(201);
    expect(res.body.titre).toBe("Cours en ligne");
    expect(res.body.type).toBe("depense");
  });

  it("POST /api/transactions should add a new INCOME", async () => {
    const nouveauRevenu = {
      titre: "Vente vieux livres",
      montant: 50,
      type: "revenu",
      categorie: "vente"
    };

    const res = await request(app)
      .post("/api/transactions")
      .send(nouveauRevenu);

    expect(res.status).toBe(201);
    expect(res.body.type).toBe("revenu");
  });

  it("POST /api/transactions without type should return 400", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .send({ titre: "Test", montant: 10 }); // Il manque le type !

    expect(res.status).toBe(400);
  });

  it("GET /api/transactions/:id should return a single transaction", async () => {
    const res = await request(app).get("/api/transactions/1");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("GET /api/transactions/:id with invalid ID should return 404", async () => {
    const res = await request(app).get("/api/transactions/999");
    expect(res.status).toBe(404);
  });

  it("PUT /api/transactions/:id should update a transaction", async () => {
    const updateData = {
      titre: "Pizza Modifiée",
      montant: 20
    };

    const res = await request(app)
      .put("/api/transactions/1")
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.titre).toBe("Pizza Modifiée");
    expect(res.body.montant).toBe(20);
  });

  it("DELETE /api/transactions/:id should delete the transaction", async () => {
    const res = await request(app).delete("/api/transactions/1");

    expect(res.status).toBe(204);

    const check = await request(app).get("/api/transactions/1");
    expect(check.status).toBe(404);
  });

});