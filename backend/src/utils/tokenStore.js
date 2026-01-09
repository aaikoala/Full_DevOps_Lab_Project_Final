const tokens = new Map();

export function createToken(userId) {
  const token =
    Math.random().toString(36).slice(2) +
    Date.now().toString(36);

  tokens.set(token, String(userId));
  return token;
}

export function verifyToken(token) {
  const userId = tokens.get(token);
  if (!userId) return null;
  return userId;
}

export function deleteToken(token) {
  tokens.delete(token);
}
