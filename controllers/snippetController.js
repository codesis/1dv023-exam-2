'use strict'

const Snippet = require('../models/snippetModel')

const snippetController = {}

// index GET
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
      createSnippets: (await Snippet.find({}))
        .map(createSnippet => ({
          username: createSnippet.username,
          title: createSnippet.title,
          snippet: createSnippet.snippet,
          createdAt: createSnippet.createdAt,
          id: createSnippet._id
        }))
    }
    res.render('snippets/index', { locals })
  } catch (error) {
    next(error)
  }
}
// create GET
snippetController.create = async (req, res, next) => {
  const locals = {
    description: '',
    done: false
  }
  if (req.session.loggedin) {
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
    let createSnippet = new Snippet({
      username: req.session.user.username,
      title: req.body.title,
      snippet: req.body.snippet
    })
    await createSnippet.save()
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

// edit GET
snippetController.edit = async (req, res, next) => {
  try {
    const createSnippet = await Snippet.findOne({ _id: req.params.id })
    const locals = {
      id: createSnippet._id,
      description: createSnippet.description,
      done: createSnippet.done
    }
    res.render('snippets/update', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}
// edit POST
snippetController.editSnippet = async (req, res, next) => {
  try {
    const result = await Snippet.updateOne({ _id: req.body.id }, {
      description: req.body.description,
      done: req.body.done === 'on'
    })
    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Snippet was successfully updated.' }
    } else {
      req.session.flash = {
        type: 'danger',
        text: 'The Snippet you attempted to update has been removed.'
      }
    }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect(`./update/${req.body.id}`)
  }
}
// delete GET
snippetController.delete = async (req, res, next) => {
  try {
    const createSnippet = await Snippet.findOne({ _id: req.params.id })
    const locals = {
      id: createSnippet._id,
      description: createSnippet.description,
      done: createSnippet.done
    }
    res.render('snippets/delete', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
  }
}
// delete POST
snippetController.deleteSnippet = async (req, res, next) => {
  try {
    await Snippet.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'The Snippet was successfully removed.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    req.redirect(`./delete/${req.body.id}`)
  }
}

module.exports = snippetController
