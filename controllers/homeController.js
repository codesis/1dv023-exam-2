'use strict'

// const Users = require('../models/createUser')
const homeController = {}

// sign out and destroy session
homeController.signOut = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

module.exports = homeController
