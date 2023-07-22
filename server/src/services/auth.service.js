const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
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

const createUser = async (userData) => {
    const {
        username, password, email, tell, invitedBy, isAdmin,
    } = userData;

    const adminExist = await verifyIfUserIsAdmin(invitedBy);
    if (adminExist.message) return adminExist;
    const userExist = await verifyIfExistUser(email);
    if (userExist.message) return userExist;

    const hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('123456', 10);
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

module.exports = {
    createUser,
};
