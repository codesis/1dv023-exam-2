'use strict'

const mongoose = require('mongoose')

// Mongoose model for user
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

userSchema.path('password').validate((password) => { return password.length >= 7 }, 'The password must be of minimum length 7 characters.')
