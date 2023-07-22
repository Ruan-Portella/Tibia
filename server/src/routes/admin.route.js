const express = require('express');
const adminController = require('../controllers/admin.controller');
const validations = require('../middlewares');

const router = express.Router();

router.get('/', validations.validateToken, validations.validateAdmin, adminController.getAllUsers);

module.exports = router;
