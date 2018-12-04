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
    let room = req.params;
    io.on('connection', async (socket) => {
        socket.on('login', async (data) => {
            socket.broadcast.emit('chat', 'hello');
        })
    });

});


module.exports = router;