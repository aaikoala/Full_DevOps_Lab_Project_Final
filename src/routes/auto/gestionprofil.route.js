/**
 * User profile management
 * GET  /profil : returns user profile
 * PUT  /profil 
 */

import { Router } from "express";

const router = Router();

// user profile
let profil = {
  nom: "Doe",
  prenom: "John",
  email: "john.doe@example.com",
};

/**
 * Get user profile
 */
router.get("/profil", (_req, res) => {
  res.status(200).json({ profil });
});

/**
 * Update user profile
 */
router.put("/profil", (req, res) => {
  let nom;
  let prenom;
  let email;

  if (req.body) {
    nom = req.body.nom;
    prenom = req.body.prenom;
    email = req.body.email;
  }

  // validation
  if (
    typeof nom !== "string" ||
    typeof prenom !== "string" ||
    typeof email !== "string" ||
    !email.includes("@")
  ) {
    return res.status(400).json({
      error: "invalid_profile",
      message: "nom, prenom and valid email are required",
    });
  }

  profil = { nom, prenom, email };

  return res.status(200).json({ profil });
});

export default router;