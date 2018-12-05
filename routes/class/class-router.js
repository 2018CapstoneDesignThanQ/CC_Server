const express = require('express');
const router = express.Router();
const db = require('../../module/db');
// let io = require('socket.io')();

const create = require('./create-class');

router.use('/create', create);



router.get('/room/:id', async (req, res) => {
    let token = req.headers.token;
    let class_id = req.params.id;
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
        //질문목록, 댓글목록 주기
        res.status(200).json({
            message: "Success Connection",
            data: check_result[0]
        });
    }
});

router.post('/room/:id/question', async (req, res) => {
    console.log('hello');
    let token = req.headers.token;
    let class_id = req.params.id;
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
        //질문정보 담아서 인서트 후 채팅전송
        io.of('/room').to(class_id).emit('question', 'hello');
        res.status(200).json({
            message: "Success Connection"
        });
    }
});

module.exports = router;
