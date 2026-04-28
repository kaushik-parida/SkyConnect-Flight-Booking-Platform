const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const jwtMiddleware = (req, res, next) => {

   const authHeader = req.headers.authorization;

if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);


        req.user = {
            id: decoded.userId,
            email: decoded.sub,
            role: decoded.role
        };

        console.log("Decoded JWT:", req.user);

        next();

    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = jwtMiddleware;