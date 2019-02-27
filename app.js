'use strict'

const express = require('express')
const path = require('path')
const hbs = require('express-hbs')
const session = require('express-session')
const logger = require('morgan')

const mongoose = require('./config/mongoose')

const app = express()

// connect to database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})
// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// setup and use session middleware (TO BE CHANGED!)
const sessionOptions = {
  name: 'name of keyboard cat',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}
app.use(session(sessionOptions))
// middleware to be executed before the routes
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash

  next()
})
// routes
app.use('/', require('./routes/homeRouter'))
app.use('/snippets', require('./routes/createSnippetRouter'))
// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})
// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal Server Error')
})
// listen to provided port
app.listen(3000, () => console.log('Server running at http://localhost:3000' + '\nPress ctrl+c to terminate'))
