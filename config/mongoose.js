// mongoose configuration

'use strict'

const mongoose = require('mongoose')

// DISCLAIMER: This is NOT how it is supposed to be but for this course it is OK.
const CONNECTION_STRING = 'mongodb://testUser:<1234>@cluster0-shard-00-00-wz1vl.mongodb.net:27017,cluster0-shard-00-01-wz1vl.mongodb.net:27017,cluster0-shard-00-02-wz1vl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'

// Establish connection to a database and @returns Promise
module.exports.connect = async () => {
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // if the Node process ends, close the connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is dc due to application termination.')
      process.exit(0)
    })
  })
  // connect to the server
  return mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
}
