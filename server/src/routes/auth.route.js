const express = require('express');
const authController = require('../controllers/auth.controller');
const validations = require('../middlewares');

const router = express.Router();

router.post('/signup', validations.validateEmail, validations.validatePassword, validations.validateName, validations.validateToken, authController.createUser);
router.post('/login', validations.validateEmail, validations.validatePassword, validations.validateName, validations.validateToken, authController.login);

module.exports = router;
