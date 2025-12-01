import request from "supertest";
import express from "express";

// 👇 CORRECTION ICI : Ajout du chemin correct vers "src/routes/auto/"
import depensesRoutes from "../src/routes/auto/depenses.route.js";

const app = express();
app.use(express.json());
app.use("/api/depenses", depensesRoutes);

describe("Dépenses API", () => {

  it("GET /api/depenses should return an array", async () => {
    const res = await request(app).get("/api/depenses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/depenses should add a new dépense", async () => {
    const nouvelleDepense = {
      titre: "Cours en ligne",
      montant: 30,
      categorie: "éducation",
      date: "2025-11-25"
    };

    const res = await request(app)
      .post("/api/depenses")
      .send(nouvelleDepense);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.titre).toBe("Cours en ligne");
    expect(res.body.montant).toBe(30);
  });

  it("POST /api/depenses without required fields should return 400", async () => {
    const res = await request(app)
      .post("/api/depenses")
      .send({ categorie: "loisir" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});