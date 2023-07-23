const express = require('express');
const authController = require('../controllers/auth.controller');
const validations = require('../middlewares');

const router = express.Router();

router.post('/login', validations.validateEmail, validations.validatePassword, validations.validateName, authController.login);

module.exports = router;
