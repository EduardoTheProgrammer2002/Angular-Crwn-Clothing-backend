const express = require('express');
const { storeItem, getUserAuthenticated, getItem, deleteItem } = require('../controllers/userControllers');
const { authenticateToken } = require('../middlewares/authorization');

const router = express.Router();

router.get("/user", authenticateToken, getUserAuthenticated);

router.post("/storeItem", authenticateToken, storeItem);

router.get("/getItems", authenticateToken, getItem);

router.delete("/deleteItem", authenticateToken, deleteItem);


module.exports = router;