const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usersController');

router.get('/', ctrl.listUsers);         // GET all users
router.post('/fetch', ctrl.fetchAndInsert); // Fetch from RandomUser
router.put('/:uuid', ctrl.updateUser);   // Update user

module.exports = router;
