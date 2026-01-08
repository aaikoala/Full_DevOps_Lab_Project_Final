import mongoose from "mongoose";
import User from "../models/user.model.js";

const memoryUsers = [];

function dbReady() {
  if (!mongoose.connection) return false;
  if (mongoose.connection.readyState === 1) return true;
  return false;
}
function findMemoryUser(id) {
  let i = 0;
  while (i < memoryUsers.length) {
    if (String(memoryUsers[i]._id) === String(id)) {
      return memoryUsers[i];
    }
    i = i + 1;
  }
  return null;
}

function removePassword(user) {
  return { _id: user._id, username: user.username, email: user.email };
}

/**
 * GET /api/users
 */
export async function listUsers(req, res, next) {
  try {
    if (!dbReady()) {
      const out = [];
      let i = 0;
      while (i < memoryUsers.length) {
        out.push(removePassword(memoryUsers[i]));
        i = i + 1;
      }
      return res.status(200).json(out);
    }

    const users = await User.find().select("-password").lean();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/users/:id
 */
export async function getUser(req, res, next) {
  try {
    if (!dbReady()) {
      const found = findMemoryUser(req.params.id);
      if (!found) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      return res.status(200).json(removePassword(found));
    }

    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/users
 */
export async function createUser(req, res, next) {
  try {
    const body = req.body;
    const username = body && body.username;
    const email = body && body.email;
    const password = body && body.password;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "username, email and password are required",
      });
    }

    if (!dbReady()) {
      // unique check simple
      let i = 0;
      while (i < memoryUsers.length) {
        if (memoryUsers[i].username === username) {
          return res.status(409).json({ error: true, message: "username or email already exists" });
        }
        if (memoryUsers[i].email === email) {
          return res.status(409).json({ error: true, message: "username or email already exists" });
        }
        i = i + 1;
      }

      const id = String(new mongoose.Types.ObjectId());
      const created = { _id: id, username: username, email: email, password: password };
      memoryUsers.push(created);

      return res.status(201).json(removePassword(created));
    }

    const createdDb = await User.create({ username: username, email: email, password: password });
    const safe = await User.findById(createdDb._id).select("-password").lean();
    return res.status(201).json(safe);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: true, message: "username or email already exists" });
    }
    return next(err);
  }
}

/**
 * PATCH /api/users/:id
 */
export async function updateUser(req, res, next) {
  try {
    const updates = req.body || {};
    const id = req.params.id;

    if (!dbReady()) {
      let index = -1;
      let i = 0;

      while (i < memoryUsers.length) {
        if (String(memoryUsers[i]._id) === String(id)) {
          index = i;
        }
        i = i + 1;
      }

      if (index === -1) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      // unique check simple
      if (updates.username || updates.email) {
        i = 0;
        while (i < memoryUsers.length) {
          if (i !== index) {
            if (updates.username && memoryUsers[i].username === updates.username) {
              return res.status(409).json({ error: true, message: "username or email already exists" });
            }
            if (updates.email && memoryUsers[i].email === updates.email) {
              return res.status(409).json({ error: true, message: "username or email already exists" });
            }
          }
          i = i + 1;
        }
      }

      if (updates.username) memoryUsers[index].username = updates.username;
      if (updates.email) memoryUsers[index].email = updates.email;
      if (updates.password) memoryUsers[index].password = updates.password;

      return res.status(200).json(removePassword(memoryUsers[index]));
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    if (!updated) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: true, message: "username or email already exists" });
    }
    return next(err);
  }
}

/**
 * DELETE /api/users/:id
 */
export async function deleteUser(req, res, next) {
  try {
    const id = req.params.id;

    if (!dbReady()) {
      let index = -1;
      let i = 0;

      while (i < memoryUsers.length) {
        if (String(memoryUsers[i]._id) === String(id)) {
          index = i;
        }
        i = i + 1;
      }

      if (index === -1) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      memoryUsers.splice(index, 1);
      return res.status(204).end();
    }

    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}