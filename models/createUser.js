'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Mongoose model for user
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})
// Using a pre-hook, salt and hash the user's password
userSchema.pre('save', function (next) {
  let user = this

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash

      next()
    })
  })
})
// Comparing passwords to authenticate
userSchema.methods.comparePassword = function (pass, callback) {
  bcrypt.compare(pass, this.password, function (err, res) {
    if (err) {
      return callback(err)
    } callback(null, res)
  })
}
// Create model by using the schema
const Users = mongoose.model('User', userSchema)

module.exports = Users
