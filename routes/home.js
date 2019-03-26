'use strict'

'use strict'

const router = require('express').Router()
const homeController = require('../controllers/homeController')

// Render index page with login form
router.route('/').get(function (req, res) {
  res.render('home/index')
})

// Login user
router.post('/signin', homeController.index)

// Logout user by destroy session
router.get('/signout', homeController.signOut)

module.exports = router
