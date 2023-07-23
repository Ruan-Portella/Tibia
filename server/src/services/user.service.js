/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const User = require('../models/user.model');
// const authService = require('./auth.service');

const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
};

module.exports = {
    getUserById,
};
