const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const db = require('../../module/db');
const crypto = require('crypto-promise');

/**
 * @description 회원가입
 * @body mail, password, nickname
 */

/**
* @swagger
* /user/signup:
*   post:
*     tags:
    *     - USER
*     description:
*         "- 사용자 회원가입"
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
 *       - name: nickname
 *         description: User's Interface Name.
 *         in: body
 *         required: true
 *         type: string
*     responses:
*     - 200:
*       description: (SUCCESS) 회원가입 성공
*/
router.post('/', async (req, res) => {
    let {mail, password, nickname} = req.body;

    //check Null Value Function
    if (check.checkNull([mail, password, nickname])) {
        res.status(400).json({
            message: "Null Value"
        });
    } else {
        let select_query = `select user_id from users where mail = ?`;
        let check_result = await check.checkDup(select_query, mail);
        if (check_result) {
            res.status(400).json({
                message: "Duplicate Mail"
            });
        }
        else {
            console.log(check_result);
            //hashing the password
            const salt = await crypto.randomBytes(32);
            const hashed_pw = await crypto.pbkdf2(password, salt.toString('base64'), 100000, 32, 'sha512');

            let insert_query = `insert into users (mail, nickname, password, salt) values (?, ?, ?, ?)`;
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
