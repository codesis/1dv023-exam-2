'use strict'
const Users = require('../models/createUser')
const sessionController = {}

sessionController.authorization = async (req, res) => { // login user
  Users.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.render('/', {
        flash: {
          type: 'danger',
          intro: 'Something went wrong',
          message: err.message
        }
      })
    }
    if (!user) {
      // if user does not exist
      req.session.flash = {
        type: 'danger',
        message: 'Username does not exist'
      }
      res.redirect('/')
    } else {
      user.comparePassword(req.body.password, function (err, userpass) { // compare passwords method is find in Users.js
        if (err) {
          res.status(422).send('problem', err.message)
        } else if (!userpass) { // if user password does not match
          console.log(err)

          req.session.flash = {
            type: 'danger',
            message: 'You have entered wrong password!'
          }
          res.redirect('/')
        } else {
          req.session.flash = {
            type: 'success',
            message: 'You are signed in!'
          }
          req.render('partials/nav', req.session.username)
          req.session.user = user
          req.session.username = req.body.username
          req.session.signedin = true
          res.redirect('../view')
        }
      })
    }
  })
}
sessionController.signOut = async (req, res) => { // logout function
  req.session.destroy() // destroy session
  res.redirect('/')
}
module.exports = sessionController
