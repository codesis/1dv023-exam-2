'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/homeController')

router.get('/', controller.index)

router.post('/', controller.indexPost)

module.exports = router
