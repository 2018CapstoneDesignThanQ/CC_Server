const express = require('express');
const router = express.Router();

const add_like = require('./question-like');

router.use('/like', add_like);

router.get('/:id', async (req, res) => {
    let question_id = req.params.id;

});

router.get('/:id', async (req, res) => {
    let question_id = req.params.id;

});

module.exports = router;
