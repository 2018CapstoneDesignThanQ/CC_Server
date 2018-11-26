const express = require('express');
const router = express.Router();

/**
 * @description 회원가입
 */
router.post('/', async (req, res) => {
    let {mail, password, name, nickname, hp} = req.body;



});


module.exports = router;
