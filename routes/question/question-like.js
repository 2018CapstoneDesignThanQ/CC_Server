const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const db = require('../../module/db');
const check = require('../../module/check');

router.post('/', async (req, res) => {
    let token = req.headers.token;
    let class_id = req.body.class_id;
    let question_id = req.body.question_id;

    if (check.checkNull([token, class_id, question_id])) {
        res.status(400).json({
            message: "Null Value"
        });
    }
    else {
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
                message: "token err" //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
            });
        }
        else {
            let check_like = `select * from question_like where question_fk = ? and user_fk = ?`;
            let check_result = await db.queryParamArr(check_like, [question_id, decoded.user_idx]);
            if (!check_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            else if (check_result.length !== 0) {
                res.status(400).json({
                    message: "Already Like"
                });
            }
            else {
                console.log(check_result);
                let transaction_result = await db.transactionControll(async (connection) => {
                    let update_query = `UPDATE question SET like_cnt = like_cnt + 1 WHERE question_id = ?`;
                    let insert_query = `insert into question_like (user_fk, question_fk) values (?, ?)`;
                    await connection.query(update_query, [question_id]);
                    await connection.query(insert_query, [decoded.user_idx, question_id]);

                    let select_question = `select (select count( * ) as like_cnt from question_like as a_like where a_like.question_fk = b.question_id  and a_like.user_fk = ? ) as is_like, a.nickname, b.* from users a, question b where b.question_id = ? and a.user_id = b.user_fk`;
                    let question_data = await connection.query(select_question, [decoded.user_idx, question_id]);
                    let select_top3 = `select a.*, b.nickname from question a, users b order by a.like_cnt limit 3`;
                    let top3_data = await connection.query(select_top3);
                    if (!question_data || !top3_data) {
                        res.status(500).json({
                            message: "Internal Server Error"
                        });
                    }
                    else {
                        const io = req.app.get('io');
                        io.of('/room').to(class_id).emit('top3', top3_data);
                        let add_like = question_data[0].like_cnt;

                        if (add_like>3) {
                            const alert_question = {
                                question_id : question_id,
                                title : question_data[0].title,
                                content : question_data[0].content
                            }
                            io.of('/room').to(class_id).emit('alertWeb', alert_question);
                        }
                        io.of('/room').to(class_id).emit('addLike', add_like);
                        res.status(200).json({
                            message: "Success Add Like",
                            data: question_data
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                });
            }
        }
    }
});

module.exports = router;