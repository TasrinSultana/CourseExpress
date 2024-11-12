const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
    try {
        // Extract token from the Authorization header
        const token = req.headers.token;
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);

        if (decoded) {
            req.userId = decoded.id;
            next()
        } else {
            res.status(403).json({
                message: "You are not signed in"
            })
        }
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }

}

module.exports = {
    userMiddleware: userMiddleware
}