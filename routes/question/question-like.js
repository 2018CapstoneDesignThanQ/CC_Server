const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const make = require('../../module/make');
const jwt = require('../../module/jwt');
const db = require('../../module/db');

router.post('/:id', async (req, res) => {
    let question_id = req.params.id;
    let token = req.headers.token;


});

module.exports = router;