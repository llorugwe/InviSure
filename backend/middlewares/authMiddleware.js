const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Log the user role and required role for debugging
            console.log(`User role: ${req.user.role}, Required role: ${requiredRole}`);

            // Check if the role is required and matches
            if (requiredRole && req.user.role !== requiredRole) {
                console.log(`Access denied for role: ${req.user.role}, required role: ${requiredRole}`);
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;
