
const express = require('express');
const router = express.Router();

router.use('/load', require('./api//main'));
router.use('/api', require('./api/api'));

module.exports = router;
