const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const db = require('../../module/db');
const crypto = require('crypto-promise');
const jwt = require('../../module/jwt');

/**
 * @description socket 통신을 위한 API
 */
router('/:room', async (req, res) => {
    let room = req.params;


});


module.exports = router;