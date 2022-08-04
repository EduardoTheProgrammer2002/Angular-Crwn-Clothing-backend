const express = require('express');
const { signUserUp, signUserIn, refreshAuth, signOut } = require('../controllers/authControllers');
const { authenticateToken } = require('../middlewares/authorization');
const router = express.Router();

//signup router
router.post('/auth/signup', signUserUp);


//signing router
router.post('/auth/signin', signUserIn);  


//refresh token or authorization
router.get('/auth/refresh', authenticateToken, refreshAuth);

//sign out
router.delete('/auth/signout', signOut);

module.exports = router;