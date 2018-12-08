const express = require('express');
const router = express.Router();
const emoji = require('node-emoji');
const check = require('../../module/check');
const make = require('../../module/make');
const jwt = require('../../module/jwt');
const db = require('../../module/db');
const apn = require('../../module/push').apn;

router.post('/:id', async (req, res) => {
    let question_id = req.params.id;
    let token = req.headers.token;

    let client_token = '';
    let push_message = '';
    apn(client_token,200, 1, {body:"(좋아요)"+ emoji.get("strawberry") + "push_message"});


});

module.exports = router;