const express = require('express');
const { singUserUp } = require('../controllers/authControllers');

const router = express.Router();


router.post('/auth/signup', singUserUp);


module.exports = router;