const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const jwt = require('../../module/jwt');

const create = require('./create-class');

router.use('/create', create);



router.get('/room/:id', async (req, res) => {
    console.log('여기입니다.');
    let token = req.headers.token;
    let class_id = req.params.id * 1;
    if (!token) {
        res.status(400).send({
            message: "Null Value"
        })
    } else {
        let decoded = jwt.verify(token);

        if (decoded === 10) {
            res.status(500).send({
                message: "token err",
                expired: 1
            });
            return;
        }
        //토큰에 에러 있을 때
        if (decoded === -1) {
            res.status(500).send({
                message: "token err"
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
                    message: "This Class  Does Not Exist"
                });
            }
            else {
                //질문목록 주기
                let select_myclass = `select user_fk from my_class where user_fk = ?`;
                let check_myclass = await db.queryParamArr(select_myclass, [decoded.user_idx]);
                if (!check_myclass) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                }
                else {
                    if(check_myclass.length === 0) {
                        let insert_class = `insert into my_class (user_fk, class_fk) values (?, ?)`;
                        let insert_result = await db.queryParamArr(insert_class, [decoded.user_idx, class_id]);
                        if (!insert_result) {
                            res.status(500).json({
                                message: "Internal Server Error"
                            });
                        }
                    }
                    const io = req.app.get('io');

                    // let select_question = `select a.nickname, b.* from users a, question b where a.user_id = ? and b.class_fk = ?`;
                    let select_question = `select (select count( * ) as like_cnt from question_like as a_like where a_like.question_fk = b.question_id  and a_like.user_fk = ? ) as is_like, a.nickname, b.* from users a, question b where a.user_id = b.user_fk and b.class_fk = ?`;
                    let question = await db.queryParamArr(select_question, [decoded.user_idx, class_id]);
                    let select_top = `select (select count( * ) as like_cnt from question_like as a_like where a_like.question_fk = b.question_id  and a_like.user_fk = ? ) as is_like, a.nickname, b.* from users a, question b where a.user_id = b.user_fk and b.class_fk = ? order by like_cnt limit 3`;
                    let top_question = await db.queryParamArr(select_top, [decoded.user_idx, class_id]);

                    if (!question || !top_question) {
                        res.status(500).json({
                            message: "Internal Server Error"
                        });
                    }
                    else {
                        res.status(200).json({
                            message: "Success Connection",
                            classData: check_result[0],
                            topQuestion: top_question,
                            questionData: question
                        });
                    }
                }
            }
        }
    }
});

router.post('/room/:id/question', async (req, res) => {
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
                        question : insert_result.insert_Id,
                        user : decoded.user_idx,
                        content : content,
                        nickname : decoded.nickname,
                        time : new Date()
                    };
                    //질문정보 담아서 인서트 후 채팅전송
                    console.log(chat);
                    io.of('/room').to(class_id).emit('question', chat);
                    res.status(200).json({
                        message: "Success Upload"
                    });
                }
            }
        }
    }
});

router.post('/room/:id/reply', async (req, res) => {
    let token = req.headers.token;
    let class_id = req.params.id;
    let content = req.body.content;
    let question_id = req.body.question;
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
                // const io = req.app.get('io');
                let insert_question = `insert into reply (user_fk, class_fk, question_fk, content) values (?, ?, ?, ?)`;
                let insert_result = await db.queryParamArr(insert_question, [decoded.user_idx, class_id, question_id, content]);
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
                    // io.of('/room').to(class_id).emit('question', chat);
                    res.status(200).json({
                        message: "Success Upload"
                    });
                }
            }
        }
    }
});
module.exports = router;
