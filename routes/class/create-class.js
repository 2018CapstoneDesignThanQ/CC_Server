const express = require('express');
const router = express.Router();
const check = require('../../module/check');
const make = require('../../module/make');
const jwt = require('../../module/jwt');
const db = require('../../module/db');


router.post('/', async (req, res) => {
    let token = req.headers.token;

    if (!token) {
        res.status(400).json({
            message: "No Token"
        });
    }
    else {
        let decoded_token = jwt.verify(token);
        if (decoded_token === 10) {
            res.status(500).json({
                message: "Token Error",
                expired: 1
            })
        }
        if (decoded_token === -1) {
            res.status(500).json({
                message: "Token Error"
            });
        }
        else {
            let {title, content} = req.body;
            if (check.checkNull([title, content])) {
                res.status(400).json({
                    message: "Null Value"
                });
            }
            else {
                //make Random Number
                let rand_num = await make.makeRandNum();
                let insert_query = `insert into class (class_id, user_fk, title, content) values (?, ?, ?, ?)`;
                let insert_result = await db.queryParamArr(insert_query, [rand_num, decoded_token.user_idx, title, content]);
                if (!insert_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                }
                else {
                    res.status(200).json({
                        message: "Success Create Class"
                    });
                }
            }
        }
    }
});

module.exports = router;
