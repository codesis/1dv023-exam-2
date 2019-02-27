'use strict'

// Mongoose model for snippets

const mongoose = require('mongoose')

// Schema for Snippets
const snippetSchema = mongoose.Schema({
  username: { type: String },
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  posted: { type: Date, required: true, default: Date.now }
})
// Model using the schema
const Snippets = mongoose.model('snippetDB', snippetSchema)

module.exports = Snippets
