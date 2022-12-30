const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.message = "Internal Server Error" || err.message;
  err.statusCode = 500 || err.statusCode;

  if (err.code == "11000") {
    const message = `Dublicate ${Object.keys(keyValue)}Found`;
    err = new ErrorHandler(message, 400);
  }

  if (err.message == "ValidationError") {
    err = new ErrorHandler(err.message, 400);
  }

  err.status(err.statusCode).json({
    message: err.message,
    status: false,
  });
};
