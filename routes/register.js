'use strict'

// const express = require('express')
const router = require('express').Router()
// const Users = require('../models/createUser')
const registerController = require('../controllers/registerController')

router.route('/register')
  .get(registerController.index)
  .post(registerController.indexPost)

module.exports = router
