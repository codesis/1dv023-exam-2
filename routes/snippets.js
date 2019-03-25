'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetController')

router.route('/snippets')
  .get(controller.index)
// GET, POST /create
router.route('/snippets/create')
  .get(controller.create)
  .post(controller.createSnippet)
// GET, POST /update
router.get('/update/:id', controller.update)
router.post('/update', controller.updateSnippet)
// GET, POST /delete
router.get('/delete/:id', controller.delete)
router.post('/delete/:id', controller.delete)

module.exports = router
