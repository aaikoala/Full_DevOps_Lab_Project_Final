import mongoose from "mongoose";
import User from "../models/user.model.js";

const memoryUsers = [];

function isDbReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * GET /api/users
 * Returns a list of users
 */
export async function listUsers(req, res, next) {
  try {
    if (!isDbReady()) {
      // sans DB : renvoie la liste mémoire (sans password)
      const safe = memoryUsers.map((u) => ({
        _id: u._id,
        username: u.username,
        email: u.email,
      }));
      return res.status(200).json(safe);
    }

    const users = await User.find().select("-password").lean();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 */
export async function getUser(req, res, next) {
  try {
    if (!isDbReady()) {
      const found = memoryUsers.find((u) => String(u._id) === String(req.params.id));
      if (!found) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      return res.status(200).json({ _id: found._id, username: found.username, email: found.email });
    }

    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users
 * body: { username, email, password }
 */
export async function createUser(req, res, next) {
  try {
    const username = req.body && req.body.username;
    const email = req.body && req.body.email;
    const password = req.body && req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "username, email and password are required",
      });
    }

    if (!isDbReady()) {
      // sans DB : création en mémoire
      const id = new mongoose.Types.ObjectId().toString();

      // Simule le unique (username/email)
      const exists = memoryUsers.some((u) => u.username === username || u.email === email);
      if (exists) {
        return res.status(409).json({ error: true, message: "username or email already exists" });
      }

      const created = { _id: id, username: username, email: email, password: password };
      memoryUsers.push(created);

      return res.status(201).json({ _id: id, username: username, email: email });
    }

    const created = await User.create({ username, email, password });
    const safe = await User.findById(created._id).select("-password").lean();
    res.status(201).json(safe);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        error: true,
        message: "username or email already exists",
      });
    }
    next(err);
  }
}

/**
 * PATCH /api/users/:id
 */
export async function updateUser(req, res, next) {
  try {
    const updates = req.body || {};

    if (!isDbReady()) {
      const i = memoryUsers.findIndex((u) => String(u._id) === String(req.params.id));
      if (i === -1) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      // unique check basique
      if (updates.username || updates.email) {
        const conflict = memoryUsers.some((u) => {
          if (String(u._id) === String(req.params.id)) return false;
          if (updates.username && u.username === updates.username) return true;
          if (updates.email && u.email === updates.email) return true;
          return false;
        });
        if (conflict) {
          return res.status(409).json({ error: true, message: "username or email already exists" });
        }
      }

      const current = memoryUsers[i];
      memoryUsers[i] = {
        _id: current._id,
        username: updates.username ? updates.username : current.username,
        email: updates.email ? updates.email : current.email,
        password: updates.password ? updates.password : current.password,
      };

      const out = memoryUsers[i];
      return res.status(200).json({ _id: out._id, username: out.username, email: out.email });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    if (!updated) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        error: true,
        message: "username or email already exists",
      });
    }
    next(err);
  }
}

/**
 * DELETE /api/users/:id
 */
export async function deleteUser(req, res, next) {
  try {
    if (!isDbReady()) {
      const i = memoryUsers.findIndex((u) => String(u._id) === String(req.params.id));
      if (i === -1) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      memoryUsers.splice(i, 1);
      return res.status(204).end();
    }

    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}