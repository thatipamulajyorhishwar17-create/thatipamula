const express = require('express');
const router = express.Router();
const { getAllReports, getReport, createReport, updateReportStatus, deleteReport } = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getAllReports);
router.get('/:id', authenticate, getReport);
router.post('/', authenticate, createReport);
router.put('/:id/status', authenticate, updateReportStatus);
router.delete('/:id', authenticate, deleteReport);

module.exports = router;
