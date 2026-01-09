import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { createToken } from "../utils/tokenStore.js";

export async function register(req, res, next) {
  try {
    // Get user data from the request body
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    // check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    // Hash the password before saving it to the database
    const hashed = await bcrypt.hash(password, 10);

    const created = await User.create({
      username,
      email,
      password: hashed
    });

    const safeUser = await User.findById(created._id).select("-password").lean();

    const token = createToken(created._id); // generate an authentication token for the user

    return res.status(201).json({
      user: safeUser,
      token: token
    });
  } catch (err) {
    // Handle duplicate username or email error
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "username or email already exists" });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    //get login credentials from the request body
    const email = req.body.email;
    const password = req.body.password;
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    // Find the user by email 
    const user = await User.findOne({ email }).select("+password");
    // if the user does not exist 
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = await User.findById(user._id).select("-password").lean();
    const token = createToken(user._id); // generate a new authentication token

    return res.status(200).json({
      user: safeUser,
      token: token
    });
  } catch (err) {
    next(err);
  }
}
