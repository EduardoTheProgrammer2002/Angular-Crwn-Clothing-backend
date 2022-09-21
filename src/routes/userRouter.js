const express = require('express');
const { storeItem, getUserAuthenticated, getItem, deleteItem, updateItemQuantity, operateOnItemQuantity } = require('../controllers/userControllers');
const { pool } = require('../db');
const { authenticateToken } = require('../middlewares/authorization');

const router = express.Router();

router.get("/user", authenticateToken, getUserAuthenticated);

router.post("/storeItem", authenticateToken, storeItem);

router.get("/getItems", authenticateToken, getItem);

router.put("/operateOnItemQuantity", authenticateToken, operateOnItemQuantity);

router.put("/updateItemQuantity", authenticateToken, updateItemQuantity);

router.delete("/deleteItem", authenticateToken, deleteItem);


module.exports = router;