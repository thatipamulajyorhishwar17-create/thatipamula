const express = require('express');
const router = express.Router();
const { getAllProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/', authenticate, getAllProjects);
router.get('/:id', authenticate, getProject);
router.post('/', authenticate, authorizeAdmin, createProject);
router.put('/:id', authenticate, authorizeAdmin, updateProject);
router.delete('/:id', authenticate, authorizeAdmin, deleteProject);

module.exports = router;
