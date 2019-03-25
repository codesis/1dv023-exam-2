'use strict'

// Mongoose model for snippets

const mongoose = require('mongoose')

// Schema for Snippets
const snippetSchema = new mongoose.Schema({
  username: { type: String },
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now }
})
// Model using the schema
const Snippets = mongoose.model('Snippets', snippetSchema)

module.exports = Snippets
