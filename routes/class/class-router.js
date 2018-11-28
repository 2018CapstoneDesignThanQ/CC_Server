const express = require('express');
const router = express.Router();

const create = require('./create-class');

router.use('/create', create);



router.get('/', async (req, res) => {

});

module.exports = router;
