const express = require('express');
const router = express.Router();
let io = require('socket.io')();

const create = require('./create-class');

router.use('/create', create);



router.get('/:room', async (req, res) => {
    console.log('hello');
    let token = req.headers.token;
    let room = req.params;
    let nsp = io.of(`/${room}`);

    nsp.on('connection', async (socket) => {
        console.log('connection Success!');
    });

    nsp.on('reg', async (content) => {

    });

});

module.exports = router;
