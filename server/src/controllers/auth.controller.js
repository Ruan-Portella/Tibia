const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    login,
};
