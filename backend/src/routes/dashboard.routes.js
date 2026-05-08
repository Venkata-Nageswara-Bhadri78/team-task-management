const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getDashboardSummary);

module.exports = router;
