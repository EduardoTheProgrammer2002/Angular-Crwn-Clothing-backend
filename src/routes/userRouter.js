const express = require('express');
const { storeItem, getUserAuthenticated, getItem, deleteItem, updateItemQuantity } = require('../controllers/userControllers');
const { authenticateToken } = require('../middlewares/authorization');

const router = express.Router();

router.get("/user", authenticateToken, getUserAuthenticated);

router.post("/storeItem", authenticateToken, storeItem);

router.get("/getItems", authenticateToken, getItem);

router.put("/updateItemQuantity", authenticateToken, updateItemQuantity);

router.delete("/deleteItem", authenticateToken, deleteItem);


module.exports = router;