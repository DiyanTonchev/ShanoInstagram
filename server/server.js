const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const handlebars = require('express-handlebars')
const serverConfig = require('./config')
const routes = require('./routes/routes')
require('./utilities/passport')()

// Initialize the Express App
const app = express()

// Set native promises as mongoose promise
mongoose.Promise = global.Promise

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!')
    throw error
  }

  require('./models/user').seedAdminUser()
  console.log('MongoDB up and running!')
})

// Apply body Parser and server public assets and routes
app.use('/favicon.ico', express.static(path.join(serverConfig.rootPath, 'public', 'images', 'favicon.ico')))
app.use(express.static(path.join(serverConfig.rootPath, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: '!t@1n@b@7k0#%-hv6n-2e2Fvb-A3jShe', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user
    res.locals.isAdmin = req.user.roles.includes('Admin')
  }

  next()
})
app.use(routes)

// Set View Engine
app.engine('handlebars', handlebars({
  defaultLayout: 'layout'
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(serverConfig.rootPath, 'views'))

// start app
app.listen(serverConfig.port, () => {
  console.log(`App is running on port ${serverConfig.port}!`)
})
