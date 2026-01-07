/**
 * GDPR routes 
 */

import { Router } from "express";

const router = Router();


let users = [
  { id: 1, username: "john", email: "john@mail.com", consent: true },
  { id: 2, username: "sara", email: "sara@mail.com", consent: true },
];

/**
 * GET /api/gdpr/info
 * Returns what data we collect and why (for transparency)
 */
router.get("/api/gdpr/info", (_req, res) => {
  return res.status(200).json({
    dataCollected: ["username", "email", "consent"],
    purpose: "Budget management",
    storage: "In memory",
    retention: "Until user deletion",
  });
});

/**
 * GET /api/gdpr/user/:id
 * Returns a user's personal data 
 */
router.get("/api/gdpr/user/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  return res.status(200).json(user);
});

/**
 * GET /api/gdpr/consent/:id
 * Returns user's consent status
 */
router.get("/api/gdpr/consent/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  return res.status(200).json({ id: user.id, consent: user.consent });
});

/**
 * DELETE /api/gdpr/user/:id
 * Deletes a user's personal data 
 */
router.delete("/api/gdpr/user/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = users.some((u) => u.id === id);
  if (!exists) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  users = users.filter((u) => u.id !== id);

  return res.status(200).json({ message: "User data deleted" });
});

export default router;
