const { pool } = require("../db");
const bcrypt = require('bcrypt');
const { getUserByEmail } = require("../utils/authHelpers");


const singUserUp = async (req, res) => {
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

module.exports = {
    singUserUp
};