export function errorHandler(err, _req, res, _next) {
  var status = 500; // default HTTP status code
  var message = "Internal Server Error";

  if (err && typeof err.status === "number") {
    status = err.status;
  }

  if (err && typeof err.message === "string" && err.message.trim() !== "") {
    message = err.message;
  }
  // Send error response
  return res.status(status).json({
    error: true,
    message: message,
  });
}
