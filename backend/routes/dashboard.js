const express = require('express');
const router = express.Router();
const { getDashboardStats, getChartData, getTopPerformers, getDepartmentOverview } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/stats', authenticate, getDashboardStats);
router.get('/charts', authenticate, getChartData);
router.get('/top-performers', authenticate, getTopPerformers);
router.get('/department-overview', authenticate, getDepartmentOverview);

module.exports = router;
