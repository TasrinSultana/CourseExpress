const jwt = require("jsonwebtoken");
const jwtSecret = "Happy";

function auth(req, res, next){
    const token = req.headers.token;
    try {
        const matchedUser = jwt.verify(token, jwtSecret); // trycatch is necessary because if fail verify will throw error
        const userId = matchedUser.id;
        req.userId = userId;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    auth
}