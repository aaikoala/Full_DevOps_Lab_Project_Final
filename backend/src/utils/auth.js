import jwt from "jsonwebtoken";

export function createToken(userId) {
  const secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.sign({ userId: userId }, secret, { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  const secret = process.env.JWT_SECRET || "dev_secret";
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.userId;
    next();
  } catch  {
    return res.status(401).json({ message: "Invalid token" });
  }
}
