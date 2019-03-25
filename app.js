'use strict'

const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const session = require('express-session')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('./config/mongoose')
const app = express()
const port = process.env.PORT || 3000

// connect to database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})
// --------CONFIGURATIONS--------------

app.engine('.hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
// additional middleware
app.use(logger('dev'))
// app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// parsing json and form data
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
// setup and use session middleware
app.use(session({
  name: 'server session',
  secret: 'k1TtYm40WM3ow',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}))
// app.use(session(sessionOptions))
// Middleware + Flash messages
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
app.use('/', require('./routes/home.js'))
app.use('/', require('./routes/snippets.js'))
app.use('/', require('./routes/register.js'))
// catch 404
app.use((req, res) => {
  res.status(404).render('errors/404')
})
// catch 400
app.use((req, res) => {
  res.status(400).render('errors/403')
})

// error handler
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('errors/500')
})
// listen to provided port
app.listen(port, () => console.log('Server running at http://localhost:3000' + '\nPress ctrl+c to terminate'))
