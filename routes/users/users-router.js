const express = require('express');
const router = express.Router();

const signup = require('./sign-up');
const dupcheck = require('./check-dup');

router.use('/signup', signup);
router.use('/dupcheck', dupcheck);

module.exports = router;
