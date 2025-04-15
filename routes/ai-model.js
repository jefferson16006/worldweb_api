const express = require('express')
const router = express.Router()
const handleChat = require('../controllers/ai-model')

router.route('/search-result').post(handleChat)

module.exports = router
