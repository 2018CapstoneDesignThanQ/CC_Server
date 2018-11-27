const express = require('express');
const router = express.Router();

const signup = require('./signup');
const dupcheck = require('./dupcheck');

router.use('/signup', signup);
router.use('/dupcheck', dupcheck);

module.exports = router;
