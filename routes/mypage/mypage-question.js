const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const db = require('../../module/db');
const check = require('../../module/check');


router.get('/', async (req, res) => {
    let token = req.headers.token;

    if (!token) {
        res.status(400).json({
            message: "No Token"
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
            let select_qeustion = `select a.question_id, a.class_fk, a.content, a.reg_time, a.like_cnt, b.title from question a, class b where a.class_fk = b.class_id and a.user_fk = ?`;
            let my_question = await db.queryParamArr(select_qeustion, [decoded.user_idx]);

            if (!my_question) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            else {
                res.status(200).json({
                    message: "Success Get User Info",
                    data: my_question
                });
            }
        }
    }
});


module.exports = router;
