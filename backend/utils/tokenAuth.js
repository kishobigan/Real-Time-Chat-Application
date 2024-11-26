const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.query.token
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateUser;
