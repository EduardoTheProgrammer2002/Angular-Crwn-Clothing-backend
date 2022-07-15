const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const authenticateToken = (req, res, next) => {
    const headers = req.headers['authorization'];
    const token = headers && headers.split(" ")[1]; // Bearer Token

    if (!token) {
        return res.status(200).json({ok: false, error: "You need to log in."});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(200).json({ok: false, err: err.message});
        }

        req.user = user;
        next();
    })
}

module.exports = {
    authenticateToken
}