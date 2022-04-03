const express = require('express');
const { login, signup, logout, getLoggedinUser, googleLogin } = require('./auth.controller');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/googleLogin', googleLogin)
router.get('/loggedinUser', getLoggedinUser);


module.exports = router;
