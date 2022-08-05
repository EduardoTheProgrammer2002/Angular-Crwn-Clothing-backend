const {pool } = require('../db');

const getItemByUniqueConstraint = async(unique) => {
    const item = await pool.query(
        `SELECT * FROM items WHERE description = $1`,
        [unique]
    );

    if (!(!!item.rowCount)) {
        console.log('itme not found')
        return null
    }

    console.log('item found');
    return item.rows;
};

module.exports = {
    getItemByUniqueConstraint
}






