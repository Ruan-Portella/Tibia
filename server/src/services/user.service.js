/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const User = require('../models/user.model');
const Char = require('../models/char.model');

const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    const chars = await Char.find({ userId: id });
    user.chars = chars;
    user.password = undefined;
    user.email = undefined;
    return user;
};

const createChar = async (char, userId) => {
    await getUserById(userId);
    const newChar = Char.create({ userId, ...char });
    return newChar;
};

module.exports = {
    getUserById,
    createChar,
};
