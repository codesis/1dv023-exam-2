'use strict'

// Mongoose model for snippets

const mongoose = require('mongoose')

// Schema for Snippets
const snippetSchema = new mongoose.Schema({
  username: { type: String },
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  posted: { type: Date, required: true, default: Date.now }
})
// Model using the schema
const Snippets = mongoose.model('Snippet', snippetSchema)

module.exports = Snippets
