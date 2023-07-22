const authService = require('../services/auth.service');

const createUser = async (req, res) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
};
