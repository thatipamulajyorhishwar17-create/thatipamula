const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, uploadPhoto, getEmployeePhoto } = require('../controllers/employeeController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authenticate, getAllEmployees);
router.get('/:id', authenticate, getEmployee);
router.post('/', authenticate, authorizeAdmin, upload.single('photo'), createEmployee);
router.put('/:id', authenticate, authorizeAdmin, upload.single('photo'), updateEmployee);
router.delete('/:id', authenticate, authorizeAdmin, deleteEmployee);
router.post('/:id/photo', authenticate, upload.single('photo'), uploadPhoto);
router.get('/:id/photo', authenticate, getEmployeePhoto);

module.exports = router;
