'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Mongoose model for user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true, maxlength: 30 },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 7 }
})
// Using a pre-hook, salt and hash the user's password
userSchema.pre('save', async function (next) {
  let user = this

  if (user.isModified('password') || user.isNew) {
    let hashPwd = await bcrypt.hash(user.password, 12)
    user.password = hashPwd
  }
  next()
})
// Comparing passwords to authenticate
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  return bcrypt.compare(candidatePassword, this.password, function (err, res) {
    if (err) {
      return callback(err)
    }
    callback(null, res)
  })
}

// Create model by using the schema
const Users = mongoose.model('User', userSchema)

module.exports = Users
