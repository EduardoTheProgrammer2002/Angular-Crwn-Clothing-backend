const express = require('express');
const { signUserUp, signUserIn } = require('../controllers/authControllers');
const { getUserByEmail } = require('../utils/authHelpers');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../utils/jwt-helper');

const router = express.Router();

//signup router
router.post('/auth/signup', signUserUp);


//signing router
router.post('/auth/signin', signUserIn);  


module.exports = router;