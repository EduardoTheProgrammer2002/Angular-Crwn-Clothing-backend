const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

function generateTokens({id, name, email}) {
    const user = {
        id,
        name,
        email
    };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '400s'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1000s'});

    return {accessToken, refreshToken};
}

module.exports = {
    generateTokens
};