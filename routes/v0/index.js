const express = require('express');
const router = express.Router();

const predictionsRouter = require('./predictions');

router.use('/predictions', predictionsRouter);

module.exports = router;
