export function currentUser(req, _res, next) {
  const userId = req.headers["x-user-id"]; // read user ID
    //chack if the userID isn't an empty string
  if (typeof userId === "string" && userId.length > 0) {
    req.userId = userId;
  } else {
    req.userId = "";
  }

  next();
}