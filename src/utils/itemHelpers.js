const {pool } = require('../db');

const getItemByUniqueConstraint = async(unique) => {
    const item = await pool.query(
        `SELECT * FROM items WHERE description = $1`,
        [unique]
    );

    if (!(!!item.rowCount)) {
        return null
    }
    return item.rows;
};

module.exports = {
    getItemByUniqueConstraint
}






