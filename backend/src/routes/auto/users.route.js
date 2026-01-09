import { Router } from "express";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/user.controller.js";

const router = Router();
//get all the users
router.get("/", listUsers);
// Create a new user
router.post("/", createUser);
// Get one user by id
router.get("/:id", getUser);
// Update a user 
router.patch("/:id", updateUser);
// Delete a user by id
router.delete("/:id", deleteUser);

export default router;
