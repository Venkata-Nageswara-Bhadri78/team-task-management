const express = require('express');
const {
  signupUser,
  loginUser,
  getMe,
} = require('../controllers/auth.controller');
const {
  signupValidator,
  loginValidator,
} = require('../validators/auth.validator');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signupValidator, validateMiddleware, signupUser);
router.post('/login', loginValidator, validateMiddleware, loginUser);
router.get('/me', authMiddleware, getMe);

module.exports = router;
