const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const db = require('../../module/db');
const crypto = require('crypto-promise');
const jwt = require('../../module/jwt');
const io = require('socket.io');

/**
 * @description socket 통신을 위한 API
 */
router('/:room', async (req, res) => {
    /*
    * 1. 질문 API(기존에 있었던 질문들 가져오는 API)
    * 2. 질문을 올리면 브로드캐스트로 전송
    * */

    let room = req.params;
    let nsp = io.of(`/${room}`);

    nsp.on('connection', async (socket) => {
        console.log('connection Success!');
    });

});


module.exports = router;