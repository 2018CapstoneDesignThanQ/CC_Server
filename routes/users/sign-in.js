const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const db = require('../../module/db');
const crypto = require('crypto-promise');
const jwt = require('../../module/jwt');
// const redis =require('../../config/redis_pool').client;

/**
 * @swagger
 * /user/signin:
 *   post:
 *     tags:
 *     - USER
 *     description:
 *         "- 사용자 로그인"
 *     produces:
 *     - application/json
 *     parameters:
 *       - name: mail
 *         description: User Mail
 *         in:  body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *      '200' :
 *              description : "Success To Sign In"
 *      '400' :
 *              description : "Null Value || Fail To Sign In"
 *      '500' :
 *              description : "Internal Server Error"
 */

router.post('/', async (req, res, next) => {

    let {mail, password, push_token} = req.body;
    push_token = push_token || null;
    if (check.checkNull([mail, password])) {
        res.status(400).json({
            message: "Null Value"
        });
    }
    else {
        let login_query = `select user_id, password, salt, nickname from users where mail = ?`;
        let login_result = await db.queryParamArr(login_query, [mail]);

        if (!login_result) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
        else if(login_result.length === 1) {
            let hashed_pw = await crypto.pbkdf2(password, login_result[0].salt, 100000, 32, 'sha512');
            if (login_result[0].password === hashed_pw.toString('base64')) {
                let add_token = `update users set push_token = ? where user_id =?`;
                let update_result = await db.queryParamArr(add_token, [push_token, login_result[0].user_id]);
                if (!update_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                }
                else {
                    console.log(login_result[0]);
                    let token = jwt.sign(login_result[0].user_id, login_result[0].nickname);

                    res.status(200).json({
                        message: "Success To Sign Up",
                        token
                    });
                }
            }
            else {
                res.status(400).json({
                    message: "Fail To Sign In"
                });
                console.log("PW Error");
            }
        }
        else {
            res.status(400).json({
                message: "Fail To Sign In"
            });
            console.log("ID Error");
        }
    }
});

module.exports = router;
