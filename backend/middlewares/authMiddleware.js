// authMiddleware.js
const jwt = require('jsonwebtoken');
const { refreshAccessToken } = require('../controllers/authController');

const authMiddleware = (requiredRoles) => {
    return async (req, res, next) => {
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

            // Check if the user's role matches any of the required roles
            if (requiredRoles && !requiredRoles.includes(req.user.role)) {
                console.log(`Access denied for role: ${req.user.role}, required roles: ${requiredRoles}`);
                return res.status(403).json({ message: 'Forbidden: Access is denied' });
            }

            next();
        } catch (err) {
            // If the token has expired, attempt to refresh it
            if (err.name === 'TokenExpiredError') {
                console.log('Token expired. Attempting to refresh...');

                const refreshToken = req.header('x-refresh-token'); // Assuming the frontend sends a refresh token in headers
                if (!refreshToken) {
                    return res.status(401).json({ message: 'No refresh token provided' });
                }

                try {
                    const newAccessToken = await refreshAccessToken(refreshToken);
                    res.setHeader('x-new-access-token', newAccessToken); // Send new token to frontend
                    return next(); // Retry the request with a refreshed token
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    return res.status(403).json({ message: 'Token refresh failed' });
                }
            } else {
                console.error('Token verification failed:', err);
                return res.status(401).json({ message: 'Invalid token' });
            }
        }
    };
};

module.exports = authMiddleware;
