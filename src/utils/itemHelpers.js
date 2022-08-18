const {pool } = require('../db');

const getSingleItem = async(description, userId) => {
    //if an item is found, chekc if the description and userId are the correct and match with the ones pass as params
    const item = await pool.query(
        `SELECT * FROM items WHERE description = $1 AND userid = $2`,
        [description, userId]
    );

    //if item is empty return null, otherwise return the items
    if (!(!!item.rowCount)) {
        return null
    }
    return item.rows;
};

const getItemQuantity = (items) => {
    // obtain the quantity of item selected by the user
    let quantity = 0;
    for(let i = 0; i < items.length; i++) {
        const item = items[i];
        quantity += Number(item.quantity);
    };

    return quantity;
};

module.exports = {
    getSingleItem,
    getItemQuantity
}