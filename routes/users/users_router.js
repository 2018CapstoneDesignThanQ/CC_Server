const express = require('express');
const router = express.Router();

const signup = require('./signup');

router.use('/signup', signup);

module.exports = router;
