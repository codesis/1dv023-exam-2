'use strict'

const moment = require('moment')
const homeController = {}

// Render index page
homeController.index = (req, res, next) => res.render('home/index')
// Render login for user
homeController.indexPost = (req, res, next) => {
  let locals = { name: req.body.name, dayName: moment().format('dddd') }
  res.render('home/index', { locals })
}

module.exports = homeController
