const express = require('express');
const { storeItem, getUserAuthenticated } = require('../controllers/userControllers');
const { pool } = require('../db');
const { authenticateToken } = require('../middlewares/authorization');
const { getItemByUniqueConstraint } = require('../utils/itemHelpers');

const router = express.Router();

router.get("/user", authenticateToken, getUserAuthenticated);

router.post("/storeItem", authenticateToken, storeItem);



module.exports = router;