const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            // Verify and decode the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Log decoded user information for debugging
            console.log(`Decoded user info:`, req.user);

            // Check if the user role is defined in the token payload
            if (!req.user.role) {
                console.error('User role is missing from token payload');
                return res.status(401).json({ message: 'Invalid token payload: Role is missing' });
            }

            // Log the user role and required roles for debugging
            console.log(`User role: ${req.user.role}, Required roles: ${requiredRoles}`);

            // Check if the user's role matches any of the required roles
            if (requiredRoles && !requiredRoles.includes(req.user.role)) {
                console.log(`Access denied for role: ${req.user.role}, required roles: ${requiredRoles}`);
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }

            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;
