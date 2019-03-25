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
// GET, POST /edit
router.get('/edit/:id', controller.edit)
router.post('/edit', controller.editSnippet)
// GET, POST /delete
router.get('/delete/:id', controller.delete)
router.post('/delete', controller.deleteSnippet)

module.exports = router
