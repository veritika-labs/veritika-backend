const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        error: "Validation failed",
        message: err.message,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        error: "Not found",
        message: err.message,
      });
      break;

    case constants.SERVER_ERROR:
      res.json({
        error: "Server error",
        message: err.message,
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        error: "Unauthorized",
        message: err.message,
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        error: "Forbidden",
        message: err.message,
      });
      break;

    default:
      break;
  }
};

module.exports = errorHandler;
