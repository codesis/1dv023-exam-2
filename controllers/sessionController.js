'use strict'

const userController = {}

userController.authorization = function (req, res, next) {
  // do authorization check
  next()
}
