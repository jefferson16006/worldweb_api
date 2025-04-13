const express = require('express');
const router = express.Router();
const { getWordFromDescription } = require('../controllers/aiController');

router.route('/suggest-word').post(getWordFromDescription);

module.exports = router;
