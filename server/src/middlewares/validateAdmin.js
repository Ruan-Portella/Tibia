const validateAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } else {
        res.status(401).json({ message: 'Usuário não é admin' });
    }
};

module.exports = validateAdmin;
