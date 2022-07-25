const { pool } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require("../utils/authHelpers");
const { generateTokens } = require("../utils/jwt-helper");


const signUserUp = async (req, res) => {
    const {
        name,
        email,
        password,
        confirmPassword 
    } = req.body;

    const user = await getUserByEmail(email);
    // User validations
    if (!name || !email || !password) {
        return res.status(200).json({ok: false, error: "Provide all fields."});
    } else if(user) {
        return res.status(200).json({ok: false, error: "Email in used, provide a new one."});
    } else if(password !== confirmPassword) {
        return res.status(200).json({ok: false, error: "Passwords do not match."});
    }

    try {
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //insert the user in the database
        return await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(200).json({ok: false, error: err.message});
                }
                const tokens = generateTokens(result.rows);
                res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true, sameSite: 'none'});
                return res.status(200).json({ok: true, msg: "Congrats! Your account's been created", tokens});
            }
        );
    } catch (error) {
        return res.status(200).json({ok: false, msg: err.message});
    }
};

const signUserIn = async (req, res) => {
    const {email, password} = req.body;

    //get the user
    const user = await getUserByEmail(email);

    //if user do not exist
    if (!user) {
        return res.status(200).json({ok: false, error: "No user with such Email."});
    }

    try {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(200).json({ok: false, error: "The password is incorrect."});
        }

        //user passed all the validations, it's time to generate tokens
        const tokens = generateTokens(user);

        //store the refresh_token in the cookies to usit to refresh the tokens.
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true, sameSite: 'none'});
        return res.status(200).json({ok: true, tokens: tokens});

    } catch (error) {
        return res.status(200).json({ok: false, error: error.message})
    }
};

const refreshAuth = (req, res) => {
    const refreshToken = req.cookies['refresh_token'];
    
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(200).json({ok: false, err: err.message});
        }
        
        req.user = user;
        const tokens = generateTokens(user)
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true, sameSite: 'none'});
        
        return res.status(200).json({ok: true, tokens: tokens});
    });
    
};

module.exports = {
    signUserUp,
    signUserIn,
    refreshAuth
};