const express = require('express');
const { signUserUp, signUserIn, refreshAuth } = require('../controllers/authControllers');
const { authenticateToken } = require('../middlewares/authorization');
const router = express.Router();

//signup router
router.post('/auth/signup', signUserUp);


//signing router
router.post('/auth/signin', signUserIn);  


//refresh token or authorization
router.get('/auth/refresh', authenticateToken, refreshAuth);


module.exports = router;