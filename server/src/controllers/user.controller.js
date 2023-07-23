const userService = require('../services/user.service');

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        if (userId !== id) throw new Error('Você não tem permissão para acessar este usuário');
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserById,
};
