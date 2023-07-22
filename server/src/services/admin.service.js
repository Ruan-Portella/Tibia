/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const User = require('../models/user.model');

const getAllUsers = async () => {
    const users = await User.find();
    if (!users) throw new Error('Não existem usuários cadastrados');
    users.forEach(async (user) => {
        const userInfo = user;
        userInfo.password = undefined;
        userInfo.email = undefined;
        userInfo.__v = undefined;

        return userInfo;
    });
    return users;
};

module.exports = {
    getAllUsers,
};
