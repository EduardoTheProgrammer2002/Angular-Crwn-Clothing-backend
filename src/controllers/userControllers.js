const { pool } = require("../db");

const getUserAuthenticated = (req, res) => {
    const {id, name, email} = req.user;

    //create a user.
    const user = {
        id,
        name, 
        email
    };

    return res.status(200).json({ok: true, user: user});
}


//store the item selected by the user
const storeItem = async (req, res) => {
    const {name, imageUrl, quantity, price, userId} = req.body;
    
    const item = await getItemByUniqueConstraint(name);
    
    //if the item is found, we want to update the quantity of the item
    if (item) {
        const newQuantity = quantity + Number(item[0]['quantity']);
        return await pool.query(
            `UPDATE items SET quantity = $1 WHERE description = $2`, 
            [newQuantity, name], 
            (err, result) => {
                if (err) {
                    return res.status(200).json({ok: false, error: err.message});
                }

                return res.status(201).json({ok: true, msg: `The ${name} quantity has been updated.`});
            }
        );
    }

    //if the item is not found, we want to store it in the table
    try {
        return await pool.query(
            `INSERT INTO items (imgurl, description, quantity, price, userid) VALUES ($1, $2, $3, $4, $5)`,
            [imageUrl, name, quantity, price, userId],
            (err, result) => {
                if (err) {
                    return res.status(200).json({ok: false, error: err.message})
                }

                return res.status(200).json({ok: true, msg: "Item stored successfully"})
            }
        );
    } catch (err) {
        return res.status(200).json({ok: false, error: err.message})
    }
};

module.exports = {
    storeItem,
    getUserAuthenticated
}