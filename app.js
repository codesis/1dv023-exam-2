'use strict'

const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
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
app.engine('.hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// setup and use session middleware
const sessionOptions = {
  name: 'server session',
  secret: 'k1TtYm40WM3ow',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}
app.use(session(sessionOptions))
// Middleware
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
// Flash messages
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  if (req.session.loggedin) {
    res.locals.loggedin = req.session.loggedin
  }
  next()
})
// routes
app.use('/', require('./routes/homeRouter'))
app.use('/snippets', require('./routes/snippetRouter'))
app.use('/newuser', require('./routes/newUserRouter'))
// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.render('errors/404')
})
// catch 400
app.use((err, req, res, next) => {
  if (err.status !== 400) {
    return next(err)
  }
  console.log(err.stack)
  res.status(400).render('errors/400')
})
// catch 500
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).render('errors/500')
})

// listen to provided port
app.listen(3000, () => console.log('Server running at http://localhost:3000' + '\nPress ctrl+c to terminate'))
