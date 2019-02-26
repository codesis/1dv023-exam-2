'use strict'

const CreateSnippet = require('../models/createSnippet')

const snippetController = {}

// index GET
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
      createSnippets: (await CreateSnippet.find({}))
        .map(createSnippet => ({
          id: createSnippet._id,
          description: createSnippet.description,
          done: createSnippet.done
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
  res.render('snippets/create', { locals })
}
// create POST
snippetController.createSnippet = async (req, res, next) => {
  try {
    const createSnippet = new CreateSnippet({
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
    const createSnippet = await CreateSnippet.findOne({ _id: req.params.id })
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
snippetController.editSnippet = async(req, res, next)
