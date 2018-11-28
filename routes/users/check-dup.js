const express = require('express');
const router = express.Router();
const check = require('../../module/check');

/**
 * @description 회원가입 전 사용자 아이디가 될 mail 중복체크
 * @body mail
 */
router.post('/', async (req, res) => {
    let mail = req.body.mail;

    //check Null Value Function
    if (check.checkNull([mail])) {
        res.status(400).json({
            message: "Null Value"
        });
    } else {
        let select_query = `select user_id from users where mail = ?`;
        if (await check.checkDup(select_query, mail)) {
            res.status(400).json({
                message: "Duplicate Mail"
            });
        }
        else {
                res.status(200).send({
                    message: "Valid Mail"
                })
        }
    }
});


module.exports = router;
