'use strict'
// route for the signed in user

const express = require('express')
const router = express.Router()

const controller = require('../controllers/sessionController')

router.post('/signin', controller.authorization, controller.index)
