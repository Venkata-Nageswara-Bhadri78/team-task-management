const sendResponse = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  sendResponse(res, statusCode, false, message, null);
};

module.exports = errorMiddleware;
