const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middlewares/authorization');

const router = express.Router();

router.get("/user", authenticateToken, async (req, res) => {
    const {id, name, email} = req.user;

    //create a user.
    const user = {
        id,
        name, 
        email
    };

    return res.status(200).json({ok: true, user: user});
})




module.exports = router;