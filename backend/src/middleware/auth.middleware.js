const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/response');

const authMiddleware = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Unauthorized access', null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Unauthorized access', null);
  }
};

module.exports = authMiddleware;
