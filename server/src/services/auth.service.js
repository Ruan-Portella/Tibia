/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/user.model');

const SECRET = process.env.JWT_SECRET || 'secret';

const verifyIfExistUser = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return { message: 'Usuário já existe' };
    }
    return { user: 'Usuário não existe' };
};

// Obtendo a data atual e formatando para o formato brasileiro:

const login = async (userData) => {
    const { email, password } = userData;

    const userExist = await verifyIfExistUser(email);

    if (userExist.user) {
        throw new Error(userExist.user);
    }

    const user = await User.findOne({ email });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Senha incorreta');
    }

    const token = jwt.sign({ id: user._id, username: user.username, admin: user.isAdmin }, SECRET, { expiresIn: '30d' });

    return {
        token, admin: user.isAdmin, id: user._id, name: user.username,
    };
};

const loginWithGoogle = async (userData) => {
    const { email } = userData;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Usuário não existe');
    }

    const token = jwt.sign({ id: user._id, username: user.username, admin: user.isAdmin }, SECRET, { expiresIn: '30d' });

    return {
        token, admin: user.isAdmin, id: user._id, name: user.username,
    };
};

module.exports = {
    login,
    verifyIfExistUser,
    loginWithGoogle,
};
