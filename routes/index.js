"use strict";

const express = require('express'),
  router = express.Router();

const user_router = require('./users/users-router');
const class_router = require('./class/class-router');
const home_router = require('./home/home-router');
const question_router = require('./question/question-router');
const mypage_router = require('./mypage/mypage-router');

router.use('/users', user_router);
router.use('/class', class_router);
router.use('/home', home_router);
router.use('/question', question_router);
router.use('/mypage', mypage_router);

module.exports = router;
