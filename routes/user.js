const express = require('express');
const router = express.Router();

const userConyrollers = require('../controllers/user');

router.post('/signup/check-email', userConyrollers.checkEmail);
router.post('/sigup/check-phone', userConyrollers.checkPhone);
router.post('/signup', userConyrollers.createUser);
// router.post('/signin', );
// router.get('/loggedin-user',);

module.exports = router;