'use strict'

const Snippets = require('../models/snippetModel')

const snippetController = {}

// index GET
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
      snippets: (await Snippets.find({}))
        .map(snippets => ({
          username: snippets.username,
          title: snippets.title,
          snippet: snippets.snippet,
          createdAt: snippets.createdAt,
          id: snippets._id
        }))
    }
    res.render('snippets/index', locals)
  } catch (error) {
    next(error)
  }
}
// create GET
snippetController.create = async (req, res, next) => {
  const locals = {
    username: req.session.username,
    snippet: ''
  }
  if (req.session.signedin) {
    res.render('snippets/create', { locals })
  } else {
    req.session.flash = {
      type: 'danger',
      message: 'You have to sign in to create a snippet'
    }
    res.redirect('/')
  }
}
// create POST
snippetController.createSnippet = async (req, res, next) => {
  try {
    const newSnippet = new Snippets({
      username: req.session.username,
      title: req.body.title,
      snippet: req.body.snippet
    })
    await newSnippet.save()
      .then(function () {
        req.session.flash = {
          type: 'success',
          message: 'Snippet was created successfully.' }
      })
    res.redirect('.')
  } catch (error) {
    req.session.flash = {
      type: 'danger',
      message: error.message }
    res.redirect('./create')
  }
}

// update GET
snippetController.update = async (req, res, next) => {
  if (req.session.signedin) {
    try {
      const snippets = await Snippets.findOne({ _id: req.params.id })
      const locals = {
        username: snippets.username,
        id: snippets._id,
        newSnippet: snippets.snippet,
        title: snippets.title
      }
      res.render('snippets/update', locals)
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message + 'You must sign in to edit' }
      res.redirect('/')
    }
  }
}
// update POST
snippetController.updateSnippet = async (req, res, next) => {
  if (req.session.username === req.body.username) {
    try {
      const result = await Snippets.updateOne({ _id: req.body.id }, {
        snippet: req.body.newSnippet,
        title: req.body.title
      })
      if (result.nModified === 1 && req.session.username === req.body.username) {
        res.redirect('/snippets')
        req.session.flash = {
          type: 'success',
          message: 'Snippet was successfully updated.' }
      } else {
        req.session.flash = {
          type: 'danger',
          message: 'The Snippet you attempted to update has been removed.'
        }
        res.redirect('/')
      }
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message + 'This snippet is not yours' }
      res.redirect(`./update/${req.body.id}`)
    }
  }
}
// delete GET
snippetController.delete = async (req, res, next) => {
  if (req.session.signedin) {
    Snippets.findOne({ _id: req.params.id }, function (err, item) {
      if (err) {
        throw err
      }
      // Make sure snippet belongs to signed in user
      if (item.username === req.session.username) {
        Snippets.findOneAndRemove({ _id: req.params.id }, function (err) {
          if (err) {
            next(err)
          }
          req.session.flash = {
            type: 'success',
            message: 'Snippet was deleted'
          }
          res.redirect('/snippets')
        })
      } else {
        req.session.flash = {
          type: 'danger',
          message: 'This is not your snippet'
        }
        res.redirect('/snippets')
      }
    })
  } else {
    req.session.flash = {
      type: 'danger',
      message: 'You need to be signed in to delete your snippet'
    }
    res.redirect('/snippets')
  }
}

module.exports = snippetController
