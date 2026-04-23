const jwt = require('jsonwebtoken');
const SECRET_KEY = "secret123@#@#$%key343";

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            console.warn("Auth Middleware: Token missing in request headers.");
            return res.status(401).json({ message: "Access denied, token missing." });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        
        req.user = decoded; 
        req.userId = decoded.id; 
        req.userEmail = decoded.email; 

        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
        }
        return res.status(401).json({ message: "Invalid token. Access denied." });
    }
};

module.exports = auth;