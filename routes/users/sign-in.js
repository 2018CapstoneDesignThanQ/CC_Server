const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const db = require('../../module/db');
const crypto = require('crypto-promise');
const jwt = require('../../module/jwt');

router.post('/', async (req, res, next) => {
    let {mail, password} = req.body;
    if (check.checkNull([mail, password])) {
        res.status(400).json({
            message: "Null Value"
        });
    }
    else {
        let login_query = `select user_id, password, salt from user where mail = ?`;
        let login_result = await db.queryParamArr(login_query, [mail]);

        if (!login_result) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
        else if(login_result.length === 1) {
            let hashed_pw = await crypto.pbkdf2(password, login_result[0].salt, 100000, 32, 'sha512');
            if (login_result[0].password === hashed_pw.toString('base64')) {
                let token = jwt.sign(login_result[0].user_id);
                res.status(200).json({
                    message: "Success To Sign Up",
                    token
                })
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
