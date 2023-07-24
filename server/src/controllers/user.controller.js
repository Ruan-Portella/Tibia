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
        res.status(201).json(char);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateChar = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const { id: userIdToken } = req.user;
        if (userIdToken !== userId) throw new Error('Você não tem permissão para atualizar um personagem para este usuário');
        const char = await userService.updateChar(req.body, userId);
        res.status(200).json(char);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChar = async (req, res) => {
    try {
        const { id } = req.body;
        const { id: userId } = req.params;
        const { id: userIdToken } = req.user;
        if (userIdToken !== userId) throw new Error('Você não tem permissão para deletar um personagem para este usuário');
        await userService.deleteChar(id);
        res.status(200).json({ message: 'Personagem deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        if (userId !== id) throw new Error('Você não tem permissão para atualizar este usuário');
        const user = await userService.updateUser(id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserById,
    createChar,
    updateChar,
    deleteChar,
    updateUser,
};
