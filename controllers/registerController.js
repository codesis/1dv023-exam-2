'use strict'

const NewUser = require('../models/createUser')
const registerController = {}

// Render registration page
registerController.index = async (req, res, next) => {
  try {
    const user = new NewUser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    res.render('home/register', { user })
  } catch (error) {
    next(error)
  }
}
// Render login for user
registerController.indexPost = (req, res, next) => {
  // creating new user from input
  const user = new NewUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  // saving the created user to database
  user.save()
    .then(function () {
      req.session.flash = {
        type: 'success',
        message: 'Creation completed'
      }
      res.redirect('/')
    })
    // catching errors
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
      res.redirect('/register')
    })
}

module.exports = registerController
