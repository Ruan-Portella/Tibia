/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const authService = require('./auth.service');

function formatDateBrazilian(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
}

const getAllUsers = async () => {
    const users = await User.find();
    if (!users) throw new Error('Não existem usuários cadastrados');

    const getUsers = users.map(async (user) => {
        const userInfo = user;
        userInfo.password = undefined;
        userInfo.email = undefined;
        userInfo.__v = undefined;

        if (userInfo.isAdmin) {
            userInfo.invitedBy = 'Usuário é Admin';
            return userInfo;
        }

        const invitedBy = await User.findById(userInfo.invitedBy);
        userInfo.invitedBy = invitedBy.username;

        return userInfo;
    });

    return Promise.all(getUsers);
};

const createUser = async (userData, invitedBy) => {
    const {
        username, email, tell, isAdmin,
    } = userData;

    const userExist = await authService.verifyIfExistUser(email);
    if (userExist.message) throw new Error(userExist.message);

    const hash = await bcrypt.hash('123456', 10);

    const newUser = await User.create({
        username,
        password: hash,
        email,
        tell,
        invitedBy,
        isAdmin,
        createdAt: formatDateBrazilian(new Date()),
    });

    newUser.password = undefined;

    return newUser;
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
};

const updateUser = async (id, userData) => {
    const user = await User.findByIdAndUpdate(id, userData);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
};

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
};
