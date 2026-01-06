export function errorHandler(err, _req, res, _next) {
  var status = 500;
  var message = "Internal Server Error";

  if (err && typeof err.status === "number") {
    status = err.status;
  }

  if (err && typeof err.message === "string" && err.message.trim() !== "") {
    message = err.message;
  }

  return res.status(status).json({
    error: true,
    message: message,
  });
}
