import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export async function register(req, res, next) {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "username, email and password are required"
      });
    }

    const existing = await User.findOne({
      $or: [{ username: username }, { email: email }]
    }).lean();

    if (existing) {
      return res.status(409).json({
        error: true,
        message: "username or email already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const created = await User.create({
      username: username,
      email: email,
      password: hashed
    });

    const safe = await User.findById(created._id).select("-password").lean();
    return res.status(201).json(safe);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "email and password are required"
      });
    }

    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: true, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: true, message: "Invalid credentials" });
    }

    const safe = await User.findById(user._id).select("-password").lean();
    return res.status(200).json(safe);
  } catch (err) {
    next(err);
  }
}
