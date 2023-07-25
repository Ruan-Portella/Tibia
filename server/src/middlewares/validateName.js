const validateName = (req, res, next) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'O campo "nome" é obrigatório' });
    }
    if (username.length < 4) {
        return res.status(400).json({ message: 'O "nome" deve ter pelo menos 4 caracteres' });
    }

    return next();
};

module.exports = validateName;
