'use strict'

const SnippetDB = require('../models/createSnippet')

const snippetController = {}

// index GET
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
      createSnippets: (await SnippetDB.find({}))
        .map(createSnippet => ({
          id: createSnippet._id,
          description: createSnippet.description,
          done: createSnippet.done
        }))
    }
    res.render('snippets/view', { locals })
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
    const createSnippet = new SnippetDB({
      description: req.body.description,
      done: req.body.done
    })
    await createSnippet.save()

    req.session.flash = { type: 'success', text: 'Snippet was created successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./create')
  }
}
// edit GET
snippetController.edit = async (req, res, next) => {
  try {
    const createSnippet = await SnippetDB.findOne({ _id: req.params.id })
    const locals = {
      id: createSnippet._id,
      description: createSnippet.description,
      done: createSnippet.done
    }
    res.render('snippets/edit', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}
// edit POST
snippetController.editSnippet = async (req, res, next) => {
  try {
    const result = await SnippetDB.updateOne({ _id: req.body.id }, {
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
    res.redirect(`./edit/${req.body.id}`)
  }
}
// delete GET
snippetController.delete = async (req, res, next) => {
  try {
    const createSnippet = await SnippetDB.findOne({ _id: req.params.id })
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
    await SnippetDB.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'The Snippet was successfully removed.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    req.redirect(`./delete/${req.body.id}`)
  }
}

module.exports = snippetController
