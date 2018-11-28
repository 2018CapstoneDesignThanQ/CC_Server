"use strict";

const express = require('express'),
  router = express.Router();

const user_router = require('./users/users-router');
const class_router = require('./class/class-router');

router.use('/users', user_router);
router.use('/class', class_router);

module.exports = router;
