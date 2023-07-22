/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model');

const verifyIfExistUser = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return { message: 'Usuário já existe' };
    }
    return { user };
};

const verifyIfUserIsAdmin = async (id) => {
    const admin = await User.findById({ _id: id });

    if (admin && !admin.isAdmin) {
        return { message: 'Usuário não é admin' };
    }

    return { admin };
};

const createUser = async (userData, invitedBy) => {
    const {
        username, email, tell, isAdmin,
    } = userData;

    const adminExist = await verifyIfUserIsAdmin(invitedBy);
    if (adminExist.message) return adminExist;
    const userExist = await verifyIfExistUser(email);
    if (userExist.message) return userExist;

    const hash = await bcrypt.hash('123456', 10);

    const newUser = await User.create({
        username,
        password: hash,
        email,
        tell,
        invitedBy,
        isAdmin,
    });

    newUser.password = undefined;

    return newUser;
};

const login = async (userData) => {
    const { email, password } = userData;

    const userExist = await verifyIfExistUser(email);

    if (userExist.user) return { message: 'Usuário não existe' };

    const user = await User.findOne({ email });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return { message: 'Senha incorreta' };

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token };
};

module.exports = {
    createUser,
    login,
};
