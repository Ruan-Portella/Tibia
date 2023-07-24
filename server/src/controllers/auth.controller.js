const jwtDecode = require('jwt-decode');
const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginWithGoogle = async (req, res) => {
    try {
        const { credential } = req.body;
        const decoded = jwtDecode(credential);
        const response = await authService.loginWithGoogle({ email: decoded.email });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    login,
    loginWithGoogle,
};
