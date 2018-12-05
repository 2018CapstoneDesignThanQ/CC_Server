const express = require('express');
const router = express.Router();
const db = require('../../module/db');
let io = require('socket.io')();

const create = require('./create-class');

router.use('/create', create);



router.get('/room/:id', async (req, res) => {
    console.log('hello');
    let token = req.headers.token;
    let class_id = req.params;
    let check_room = `select * from class where class_id = ?`;
    let check_result = await db.queryParamArr(check_room, [class_id]);
    if (!check_result) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
    else if (check_result.length === 0) {
        res.status(400).json({
            message: "This Class Does Not Exist"
        });
    }
    else {
        const io = req.app.get('io');

    }


});

module.exports = router;
