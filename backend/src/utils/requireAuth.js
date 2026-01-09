import { verifyToken } from "./tokenStore.js";

//Checks if the request contains a valid token
export function requireAuth(req, res, next) {

    console.log("AUTH HEADER", req.headers.authorization);
    const header = req.headers.authorization;
    // if no token is provided
    if (!header) {
    return res.status(401).json({ message: "Missing token" });
    }

    const parts = header.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const token = parts[1]; //extract the token part
    const userId = verifyToken(token); // Verify the token and get the user id
    // if the token is invalid
    if (!userId) {
        return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = userId;
    next();
}
