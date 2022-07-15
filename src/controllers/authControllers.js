const { pool } = require("../db");
const bcrypt = require('bcrypt');
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
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(200).json({ok: false, error: err.message});
                }
                return res.status(200).json({ok: true, msg: "Your account has been created"});
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
        return res.status(200).json({ok: false, error: "No user with such Email"});
    }

    try {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(200).json({ok: false, msg: "User signed in"});
        }

        //user passed all the validations, it's time to generate tokens
        const tokens = generateTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true, sameSite: 'none'});

        req.user = user;
        return res.status(200).json({ok: true, tokens: tokens});

    } catch (error) {
        return res.status(200).json({ok: false, error: error.message})
    }
};

module.exports = {
    signUserUp,
    signUserIn
};