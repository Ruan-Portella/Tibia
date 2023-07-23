const userService = require('../services/user.service');

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, admin } = req.user;
        if (!admin && userId !== id) throw new Error('Você não tem permissão para acessar este usuário');
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createChar = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        if (userId !== id) throw new Error('Você não tem permissão para criar um personagem para este usuário');
        const char = await userService.createChar(req.body, id);
        res.status(200).json(char);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserById,
    createChar,
};
