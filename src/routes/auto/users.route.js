/**
 * POST /register : create a new user 
 */
import { Router } from "express";

const router = Router();

// table to store users
let users = [
  { id: 1, name: "Ali", email: "ali@example.com", password: "123456" },
  { id: 2, name: "Sara", email: "sara@example.com", password: "pass123" }
];


router.get("/api/register", (req, res) => {
  res.status(200).json({
    message: "Welcome to the registration API. Use POST /register with name, email and password in the JSON body"
  });
});

// user registration route
router.post("/api/register", (req, res) => {
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