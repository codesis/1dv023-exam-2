'use strict'

const moment = require('moment')
const homeController = {}

// indexGET
homeController.index = (req, res, next) => res.render('home/index')
// indexPOST
homeController.indexPost = (req, res, next) => {
  let locals = { name: req.body.name, dayName: moment().format('dddd') }
  res.render('home/index', { locals })
}
