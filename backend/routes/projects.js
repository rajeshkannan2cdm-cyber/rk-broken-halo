const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  seedProjects
} = require('../controllers/projectController');

// GET /api/projects - Retrieve all projects
router.get('/', getAllProjects);

// POST /api/projects/seed - Seed default projects to DB
router.post('/seed', seedProjects);

// GET /api/projects/:id - Retrieve single project
router.get('/:id', getProjectById);

module.exports = router;
