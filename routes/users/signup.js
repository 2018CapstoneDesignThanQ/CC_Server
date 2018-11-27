const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const db = require('../../module/db');
const crypto = require('crypto-promise');

/**
 * @description 회원가입
 * @body mail, password, nickname
 */
router.post('/', async (req, res) => {
    let {mail, password, nickname} = req.body;

    //check Null Value Function
    if (check.checkNull([mail, password, nickname])) {
        res.status(400).json({
            message: "Null Value"
        });
    } else {
        let select_query = `select user_id from user where mail = ?`;
        if (check.checkDup(select_query, mail)) {
            res.status(400).json({
                message: "Duplicate Mail"
            });
        }
        else {
            //hashing the password
            const salt = await crypto.randomBytes(32);
            const hashed_pw = await crypto.pbkdf2(password, salt.toString('base64'), 100000, 32, 'sha512');

            let insert_query = `insert into user (mail, nickname, password, salt) values (?, ?, ?, ?)`;
            let insert_result = await db.queryParamArr(insert_query, [mail, nickname, hashed_pw.toString('base64'), salt.toString('base64')]);

            if (!insert_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            else {
                res.status(200).send({
                    message: "Success To Sign Up"
                })
            }
        }
    }
});


module.exports = router;
