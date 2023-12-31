const express = require('express');
const userController = require('../controllers/user.controller');
const validations = require('../middlewares');

const router = express.Router();

router.get('/:id', validations.validateToken, userController.getUserById);
router.put('/:id/profile', validations.validateToken, userController.updateUser);
router.post('/:id', validations.validateToken, userController.createChar);
router.put('/:id', validations.validateToken, userController.updateChar);
router.delete('/:id', validations.validateToken, userController.deleteChar);

module.exports = router;
