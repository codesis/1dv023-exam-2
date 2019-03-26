'use strict'

const Users = require('../models/createUser')
const homeController = {}

// Render index page
homeController.index = (req, res) => {
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
      user.comparePassword(req.body.password, function (err, pass) {
        if (err) {
          res.status(422).send('problem', err.message)
        } else if (!pass) {
          // if passwords do not match
          req.session.flash = {
            type: 'danger',
            message: 'Wrong password'
          }
          res.redirect('/')
        } else {
          req.session.flash = {
            type: 'success',
            message: 'Welcome, ' + req.body.username + '! You have signed in!'
          }
          req.session.user = user
          req.session.username = req.body.username
          req.session.signedin = true
          res.redirect('../snippets')
        }
      })
    }
  })
}
// sign out and destroy session
homeController.signOut = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

module.exports = homeController
