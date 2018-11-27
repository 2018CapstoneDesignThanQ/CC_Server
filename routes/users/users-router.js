const express = require('express');
const router = express.Router();

const signup = require('./sign-up');
const signin = require('./sign-in');
const dupcheck = require('./check-dup');

router.use('/signup', signup);
router.use('/signin', signin);
router.use('/dupcheck', dupcheck);

module.exports = router;
