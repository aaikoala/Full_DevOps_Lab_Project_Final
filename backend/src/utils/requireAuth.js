import { verifyToken } from "./tokenStore.js";

export function requireAuth(req, res, next) {

    console.log("AUTH HEADER", req.headers.authorization);
    const header = req.headers.authorization;

    if (!header) {
    return res.status(401).json({ message: "Missing token" });
    }

    const parts = header.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const token = parts[1];
    const userId = verifyToken(token);

    if (!userId) {
        return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = userId;
    next();
}
