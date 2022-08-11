const express = require('express');
const { storeItem, getUserAuthenticated, getItem } = require('../controllers/userControllers');
const { authenticateToken } = require('../middlewares/authorization');

const router = express.Router();

router.get("/user", authenticateToken, getUserAuthenticated);

router.post("/storeItem", authenticateToken, storeItem);

router.get("/getItems", authenticateToken, getItem);


module.exports = router;