const express = require('express');
const userController = require('../controllers/user.controller');
const validations = require('../middlewares');

const router = express.Router();

router.get('/:id', validations.validateToken, validations.validateAdmin, userController.getUserById);
router.post('/:id', validations.validateToken, userController.createChar);
router.put('/:id', validations.validateToken, userController.updateChar);

module.exports = router;
