"use strict";

const express = require('express'),
  router = express.Router();

const user_router = require('./users/users-router');

router.use('/users', user_router);

module.exports = router;
