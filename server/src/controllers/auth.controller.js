const authService = require('../services/auth.service');

const createUser = async (req, res) => {
    try {
        const user = await authService.createUser(req.body, req.user.id);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    login,
};
