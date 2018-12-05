const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const jwt = require('../../module/jwt');

const create = require('./create-class');

router.use('/create', create);



router.get('/room/:id', async (req, res) => {
    let token = req.headers.token;
    let class_id = req.params.id;
    if (!token) {
        res.status(400).send({
            message: "Null Value"
        })
    } else {
        let decoded = jwt.verify(token);

        if (decoded === 10) {
            res.status(500).send({
                message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
                expired: 1
            });
            return;
        }
        //토큰에 에러 있을 때
        if (decoded === -1) {
            res.status(500).send({
                message: "token err" //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
            });
        } else {
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
        }
    }
});

router.post('/room/:id/question', async (req, res) => {
    console.log('hello');
    let token = req.headers.token;
    let class_id = req.params.id;
    let content = req.body.content;
    if (!token) {
        res.status(400).send({
            message: "Null Value"
        })
    } else {
        let decoded = jwt.verify(token);

        if (decoded === 10) {
            res.status(500).send({
                message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
                expired: 1
            });
            return;
        }
        //토큰에 에러 있을 때
        if (decoded === -1) {
            res.status(500).send({
                message: "token err" //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
            });
        } else {
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
                let insert_question = `insert into question (user_fk, class_fk, content) values (?, ?, ?)`;
                let insert_result = await db.queryParamArr(insert_question, [decoded.user_idx, class_id, content]);
                if (!insert_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                }
                else {
                    const chat = {
                        class : class_id,
                        user : decoded.user_idx,
                        content : content
                    };
                    //질문정보 담아서 인서트 후 채팅전송
                    console.log(chat);
                    io.of('/room').to(class_id).emit('question', chat);
                    res.status(200).json({
                        message: "Success Connection"
                    });
                }
            }
        }
    }
});

module.exports = router;
