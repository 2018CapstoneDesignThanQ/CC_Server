const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const db = require('../../module/db');

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
       if (decoded === -1) {
           res.status(500).send({
               message: "token err"
           });
       }
       else {
           //유저정보
           let select_query = `select nickname, user_img from users where user_id = ?`;
           //내가 개설한 강의(status 구분)
           let my_class = `select class_id, title from class where user_fk = ? and status = 1`;
            //내가 수강중인 강의
           let apply_class = `
           select a.class_id, a.title, c.nickname 
           from class a, my_class b, users c 
           where a.class_id = b.class_fk and b.user_fk = ? and c.user_id = a.user_fk and a.status = 1
           `;

           let user_data = await db.queryParamArr(select_query, [decoded.user_idx]);
           let class_data = await db.queryParamArr(my_class, [decoded.user_idx]);
           let apply_data = await db.queryParamArr(apply_class, [decoded.user_idx]);

           if (!user_data || !class_data || !apply_data) {
               res.status(500).json({
                   message: "Internal Server Error"
               });
           }
           else {
               res.status(200).json({
                   message: "Success Get Data",
                   user : user_data[0],
                   class_data,
                   apply_data
               });
           }
       }
   }
});

module.exports = router;
