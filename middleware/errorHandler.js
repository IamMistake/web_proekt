const createError = (statusCode, message, code, details) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  if (details) {
    error.details = details;
  }
  return error;
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");
  const payload = {
    error: {
      message: err.message || "Server Error",
      code,
    },
  };
  if (err.details) {
    payload.error.details = err.details;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  errorHandler,
  createError,
};
