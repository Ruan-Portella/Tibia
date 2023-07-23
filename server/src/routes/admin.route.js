const express = require('express');
const adminController = require('../controllers/admin.controller');
const validations = require('../middlewares');

const router = express.Router();

router.get('/', validations.validateToken, validations.validateAdmin, adminController.getAllUsers);
router.post('/', validations.validateEmail, validations.validatePassword, validations.validateName, validations.validateToken, validations.validateAdmin, adminController.createUser);
router.delete('/', validations.validateToken, validations.validateAdmin, adminController.deleteUser);

module.exports = router;
