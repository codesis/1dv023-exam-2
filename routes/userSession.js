'use strict'
// route for the signed in user

const express = require('express')
const router = express.Router()
const sessionController = require('../controllers/sessionController')

router.post('/signin', sessionController.authorization)

router.get('/signout', sessionController.signOut)

module.exports = router
