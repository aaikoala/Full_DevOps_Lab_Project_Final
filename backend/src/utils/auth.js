import jwt from "jsonwebtoken";

// Create a jwt token for a user
export function createToken(userId) {
  const secret = process.env.JWT_SECRET || "dev_secret"; //secret key used to sign the token
  return jwt.sign({ userId: userId }, secret, { expiresIn: "7d" });
}

// Checks if the request contains a valid JWT token
export function requireAuth(req, res, next) {
  const secret = process.env.JWT_SECRET || "dev_secret"; // secret key used to verify the token
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  const token = parts[1]; //extract the token part

  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.userId;
    next();
  } catch  {
    // if the token is invalid
    return res.status(401).json({ message: "Invalid token" });
  }
}
