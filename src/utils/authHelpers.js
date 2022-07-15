const { pool } = require("../db");

const getUserByEmail = async (email) => {
    
    const user = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]
    );

    return user.rowCount === 0 ? null: user.rows[0];
};

module.exports = {
    getUserByEmail
}