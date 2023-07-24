const express = require('express');
const authController = require('../controllers/auth.controller');
const validations = require('../middlewares');

const router = express.Router();

router.post('/login', validations.validateEmail, validations.validatePassword, authController.login);
router.post('/loginWithGoogle', authController.loginWithGoogle);

module.exports = router;
