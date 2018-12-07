const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');

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
               message: "token err"
           });
       }
       else {
           let select_query = `select * from `
       }
   }
});

module.exports = router;
