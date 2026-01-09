export function currentUser(req, _res, next) {
  const userId = req.headers["x-user-id"];

  if (typeof userId === "string" && userId.length > 0) {
    req.userId = userId;
  } else {
    req.userId = "";
  }

  next();
}