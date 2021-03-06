const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const db = require('../../module/db');
const check = require('../../module/check');

const mypage_class = require('./mypage-class');
const mypage_question = require('./mypage-question');
const mypage_like = require('./mypage-like');

router.use('/class', mypage_class);
router.use('/question', mypage_question);
router.use('/like', mypage_like);

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
            let select_user = `select user_id, nickname, user_img from users where user_id = ?`;
            let user_info = await db.queryParamArr(select_user, [decoded.user_idx]);

            if (!user_info) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            else {
                res.status(200).json({
                    message: "Success Get User Info",
                    data: user_info[0]
                });
            }
        }
    }
});

module.exports = router;
