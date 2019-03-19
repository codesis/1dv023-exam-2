'use strict'

const express = require('express')
const router = express.Router()
const NewUser = require('../models/createUser')

router.route('/newuser')
  .get(function (req, res) {
    res.render('home/newuser')
  })
  .post(function (req, res) {
    const user = new NewUser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    user.save()
      .then(function () {
        req.session.flash = {
          type: 'success',
          message: 'Creation completed'
        }
        res.redirect('/')
      })
      .catch(function (err) {
        if (err.name === 'ValidationError' && err.errors.username) {
          req.session.flash = {
            type: 'danger',
            message: 'Maximum 20 characters for username'
          }
        } else if (err.name === 'ValidationError' && err.errors.password) {
          req.session.flash = {
            type: 'danger',
            message: 'Password must contain minimum 7 characters'
          }
        } else {
          req.session.flash = {
            type: 'danger',
            message: err.message
          }
        }
        res.redirect('/newuser')
      })
  })
module.exports = router
