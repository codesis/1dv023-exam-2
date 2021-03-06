'use strict'

const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const session = require('express-session')
const logger = require('morgan')
const helmet = require('helmet')
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
app.use(helmet())
app.engine('.hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
// additional middleware
app.use(logger('dev'))
// app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public/')))
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
    sameSite: 'lax',
    maxAge: 3600000 // 1 hour to highten security
  }
}))
// Middleware + Flash messages
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  if (req.session.signedin) {
    res.locals.signedin = req.session.signedin
  }
  next()
})
// routes
app.use('/', require('./routes/home.js'))
app.use('/', require('./routes/snippets.js'))
app.use('/', require('./routes/register.js'))
app.use('/', require('./routes/userSession.js'))
// catch 404
app.use((req, res) => {
  res.status(404).render('errors/404')
})
// catch 403
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
