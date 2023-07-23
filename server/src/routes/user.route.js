const express = require('express');
const userController = require('../controllers/user.controller');
const validations = require('../middlewares');

const router = express.Router();

router.get('/:id', validations.validateToken, userController.getUserById);

module.exports = router;
