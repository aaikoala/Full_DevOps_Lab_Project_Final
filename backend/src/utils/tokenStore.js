const tokens = new Map();

//Create a new authentication token
export function createToken(userId) {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36); // generate a random token string

  tokens.set(token, String(userId)); //associate the token with an user id
  return token;
}

export function verifyToken(token) {
  const userId = tokens.get(token); // Get user ID linked to the token
  if (!userId) return null;
  return userId;
}

export function deleteToken(token) {
  tokens.delete(token);
}
