/**
 * POST /register → create a new user 
 */
import { Router } from "express";
//ajouter bcrypt pour le hachage de mot de passe

const router = Router();

// table to store users
let users = [
  { id: 1, name: "Ali", email: "ali@example.com", password: "123456" },
  { id: 2, name: "Sara", email: "sara@example.com", password: "pass123" }
];


router.get("/register", (req, res) => {
  res.status(200).json({
    message: "Bienvenue sur l'API d'inscription. Utilise POST /register avec name, email, password dans le body JSON."
  });
});

// user registration route
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  //field verification
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Missing fields. Please provide name, email and password"
    });
  }
  // create the new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };

  // add to the table
  users.push(newUser);

  // response
  res.status(201).json(newUser);
});

export default router;