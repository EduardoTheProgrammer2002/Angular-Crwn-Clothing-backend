const { pool } = require("../db");
const { getSingleItem, getItemQuantity } = require("../utils/itemHelpers");

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

//this deletes all the items amount for a specific item
const deleteItem = async (req, res) => {
    const {description} = req.body;
    const userId = req.user.id;

    //get a single item
    const item = await getSingleItem(description, userId);

    if(!item) {
        return res.status(404).json({ok: false, err: "Item not found"});
    }

    return await pool.query(
        `DELETE FROM items WHERE description=$1 AND userId=$2`,
        [description, userId],
        (err, result) => {
            if (err) {
                return res.status(200).json({ok: false, err: err.message});
            }
            return res.status(200).json({ok: true, msg: "Item deleted successfully!"})
        }
    );
};

//update a single item quantity
const updateItemQuantity =  async (req, res) => {
    const userId = req.user.id;
    const {quantity, item} = req.body;
    
    return await pool.query(
        `UPDATE items SET quantity = $1 WHERE description = $2 AND userID = $3`,
        [quantity, item.description, userId],
        (err, result) => {
            if (err) {
                res.status(200).json({ok: false, err: err.message});
                return
            }

            res.status(200).json({ok: true, msg: "Item quantity UPDATED"});
            return
        }
    );
};

//store the item selected by the user
const storeItem = async (req, res) => {
    const {name, imgUrl, price} = req.body;
    const userId = req.user.id;
    const defaultQuantity = 1;
    
    //get a single item
    const item = await getSingleItem(name, userId);
    
    //if the item is found, we want to update the quantity of the item
    if (item) {
        const newQuantity = 1 + Number(item[0]['quantity']);
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
            [imgUrl, name, defaultQuantity, price, userId],
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

const getItem = async (req, res) => {
    //get the user authenticated to use the id
    const user = req.user;

    try {
        //try to get the item form the database.
        const items = await pool.query(
            `SELECT imgurl,description,quantity,price FROM items WHERE userid = $1`,
            [user.id]
        );
        
        //if this is true, the user items variable is empty what means that the user haven't selected any items yet.
        if (items.rowCount === 0) {
           return  res.status(200).json({ok: false, items: null, totalQuantity: 0});    
        } 
        
        //get the total quantity of items to send it to the frontend
        const itemsQuantity = getItemQuantity(items.rows);

        //send the items to the client side
        return res.status(200).json({ok: true, items: items.rows, itemsQuantity: itemsQuantity});

    } catch (error) { // an error has come up, just send it to the client side.
        return res.status(200).json({ok: false, error: error.msg, items: null, itemsQuantity: 0});
    }
};


module.exports = {
    storeItem,
    getUserAuthenticated,
    getItem,
    deleteItem,
    updateItemQuantity
}