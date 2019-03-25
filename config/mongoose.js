// mongoose configuration

'use strict'

const mongoose = require('mongoose')

// DISCLAIMER: This is NOT how it is supposed to be but for this course it is OK.
const CONNECTION_STRING = 'mongodb+srv://Admin:1234abcd@cluster0-wz1vl.mongodb.net/StickySnippetsDatabase?retryWrites=true'

// Establish connection to a database and @returns Promise
module.exports.connect = async () => {
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection has disconnected.'))

  // if the Node process ends, close the connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection has disconnected due to application termination.')
      process.exit(0)
    })
  })
  // connect to the server
  return mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
}
