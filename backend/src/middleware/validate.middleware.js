const { validationResult } = require('express-validator');
const sendResponse = require('../utils/response');

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendResponse(res, 400, false, 'Validation failed', formattedErrors);
  }
  next();
};

module.exports = validateMiddleware;
