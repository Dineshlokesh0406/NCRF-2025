const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    console.log('Auth headers:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        console.log('Verifying token with secret:', process.env.JWT_TOKEN_SECRET ? 'Secret exists' : 'No secret found');
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        console.log('Token decoded:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = {
    verifyToken: authMiddleware
};