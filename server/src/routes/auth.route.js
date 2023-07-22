const express = require('express');
const authController = require('../controllers/auth.controller');
const validations = require('../middlewares');

const router = express.Router();

router.post('/createUser', validations.validateEmail, validations.validatePassword, validations.validateName, validations.validateToken, validations.validateAdmin, authController.createUser);
router.post('/login', validations.validateEmail, validations.validatePassword, validations.validateName, validations.validateToken, authController.login);

module.exports = router;
