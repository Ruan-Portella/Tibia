const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model');

const createUser = async (userData) => {
    const {
        username, password, email, tell, invitedBy, isAdmin,
    } = userData;
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
