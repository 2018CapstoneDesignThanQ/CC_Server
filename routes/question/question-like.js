const express = require('express');
const router = express.Router();
const emoji = require('node-emoji');
const make = require('../../module/make');
const jwt = require('../../module/jwt');
const db = require('../../module/db');
const check = require('../../module/check');
const apn = require('../../module/push').apn;

router.post('/:class/:question', async (req, res) => {
    let class_id = req.params.class;
    let question_id = req.params.question;
    let token = req.headers.token;
    if (check.checkNull([question_id, token])) {
        res.status(400).json({
            message: "Null Value"
        });
    }
    else {
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
        }
        else {
            let select_question = `select a.*, b.push_token, b.nickname from question a, users b where a.question_id = ? and a.user_fk = b.user_id`;
            let question_data = await db.queryParamArr(select_question, [question_id]);
            if (!question_id) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            else {
                let transaction_result = await db.transactionControll(async (connection) => {
                    let update_query = `UPDATE question SET like_cnt = like_cnt + 1 WHERE question_id = ?`;
                    let insert_query = `insert into question_like (user_fk, question_fk) values (?, ?)`;
                    await connection.query(update_query, [question_id]);
                    await connection.query(insert_query, [decoded.user_idx, question_id]);
                    // res.status(200).json({
                    //     message: "Success To Like Question"
                    // })
                }).catch(error => {
                    // return next(error)
                    console.log(error);
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                });
                if (!transaction_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                }
                else {
                    // await checkTop3(class_id);
                    let client_token = question_data[0].push_token;
                    let push_message = '회원님의 게시글에 좋아요가 추가되었습니다';
                    apn(client_token,200, 1, {body:"(좋아요)"+ emoji.get("strawberry") + `${push_message}`});
                }
            }
        }
    }
});

// router.post('/:class/:question', async (req, res) => {
//     let class_id = req.params.class;
//     let question_id = req.params.question;
//     let token = req.headers.token;
//     if (check.checkNull([question_id, token])) {
//         res.status(400).json({
//             message: "Null Value"
//         });
//     }
//     else {
//         let decoded = jwt.verify(token);
//
//         if (decoded === 10) {
//             res.status(500).send({
//                 message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
//                 expired: 1
//             });
//             return;
//         }
//         //토큰에 에러 있을 때
//         if (decoded === -1) {
//             res.status(500).send({
//                 message: "token err" //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
//             });
//         }
//         else {
//             let select_question = `select * from question where question_id = ?`;
//             let question_data = await db.queryParamArr(select_question, [question_id]);
//             if (!question_id) {
//                 res.status(500).json({
//                     message: "Internal Server Error"
//                 });
//             }
//             else {
//                 let transaction_result = await db.transactionControll(async (connection) => {
//                     let update_query = `UPDATE question SET like_cnt = like_cnt + 1 WHERE question_id = ?`;
//                     let insert_query = `insert into question_like (user_fk, question_fk) values (?, ?)`;
//                     await connection.query(update_query, [question_id]);
//                     await connection.query(insert_query, [decoded.user_idx, question_id]);
//                     // res.status(200).json({
//                     //     message: "Success To Like Question"
//                     // })
//                 }).catch(error => {
//                     // return next(error)
//                     console.log(error);
//                     res.status(500).json({
//                         message: "Internal Server Error"
//                     })
//                 });
//                 if (!transaction_result) {
//                     res.status(500).json({
//                         message: "Internal Server Error"
//                     })
//                 }
//                 else {
//                     await checkTop3(class_id);
//                     // let client_token = '';
//                     // let push_message = '';
//                     // apn(client_token,200, 1, {body:"(좋아요)"+ emoji.get("strawberry") + "push_message"});
//                 }
//             }
//         }
//     }
// });


module.exports = router;