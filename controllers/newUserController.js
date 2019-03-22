'use strict'

const moment = require('moment')
const newUserController = {}

// Render index page
newUserController.index = (req, res, next) => res.render('/newuser/index')
// Render login for user
newUserController.indexPost = (req, res, next) => {
  let locals = { name: req.body.name, dayName: moment().format('dddd') }
  res.render('/newuser', { locals })
}

module.exports = newUserController
