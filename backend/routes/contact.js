const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');

// POST /api/contact - Submit new message
router.post('/', submitContact);

// GET /api/contact - Retrieve messages (helper/admin)
router.get('/', getContacts);

module.exports = router;
