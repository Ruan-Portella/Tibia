/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Char = require('../models/char.model');

const validateIfExistChar = async (id) => {
    const char = await Char.findById(id);
    return char;
};

const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    const chars = await Char.find({ userId: id });
    user.chars = chars;
    user.password = undefined;
    return user;
};

const createChar = async (char, userId) => {
    await getUserById(userId);
    const newChar = Char.create({ userId, ...char });
    return newChar;
};

const updateChar = async (char, userId) => {
    await getUserById(userId);
    const charExist = await validateIfExistChar(char.id);
    if (!charExist) throw new Error('Personagem não encontrado');
    await Char.findByIdAndUpdate(char.id, char);
    const updatedChar = await Char.findById(char.id);
    return updatedChar;
};

const deleteChar = async (id) => {
    const charExist = await validateIfExistChar(id);
    if (!charExist) throw new Error('Personagem não encontrado');
    await Char.findByIdAndDelete(id);
};

const updateUser = async (id, user) => {
    await getUserById(id);
    if (user.password) {
        const newPassword = user;
        newPassword.password = await bcrypt.hash(user.password, 10);
    }
    await User.findByIdAndUpdate(id, user);
    const userUpdated = await User.findById(id);
    return userUpdated;
};

module.exports = {
    getUserById,
    createChar,
    updateChar,
    deleteChar,
    updateUser,
};
