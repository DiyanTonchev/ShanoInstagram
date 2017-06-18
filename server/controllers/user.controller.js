const User = require('./../models/user')
const encryption = require('./../utilities/encryption')
const messages = require('./../utilities/messages')

function getRegisterPage (req, res) {
  res.render('user/register')
}

function getLoginPage (req, res) {
  res.render('user/login')
}

function getProfile (req, res) {
  let username = req.params.username

  User
    .findOne({ username })
    .populate({
      path: 'images',
      options: { limit: 100, sort: '-createdAt' }
    })
    .then((user) => {
      res.render('user/profile', { user })
    })
    .catch(err => res.status(500).send(err))
}

function register (req, res) {
  let data = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    gender: req.body.gender
  }

  if (req.body.password && req.body.password !== req.body.confirmedPassword) {
    data.error = messages.errors.passwordsNotMatch
    res.render('user/register', data)
    return
  }

  if (req.body.password) {
    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, req.body.password)
    data.salt = salt
    data.password = hashedPassword
  }

  User
    .create(data)
    .then((user) => {
      req.login(user, (error, user) => {
        if (error) {
          console.error(error)
          res.locals.globalError = error
          res.render('user/register')
          return
        }

        res.redirect(302, '/')
      })
    })
    .catch((error) => {
      data.error = error
      res.render('user/register', data)
    })
}

function login (req, res) {
  let userToLogin = {
    username: req.body.username,
    password: req.body.password
  }

  User
    .findOne({ username: userToLogin.username })
    .then((user) => {
      if (!user || !user.authenticate(userToLogin.password)) {
        res.locals.globalError = messages.errors.invalidCredentials
        res.render('user/login')
      } else {
        req.login(user, (error, user) => {
          if (error) {
            console.error(error)
            res.locals.globalError = error
            res.render('user/register')
            return
          }

          res.redirect(302, '/')
        })
      }
    })
}

function logout (req, res) {
  req.logout()
  res.redirect(302, '/')
}

module.exports = {
  getRegisterPage,
  getLoginPage,
  getProfile,
  register,
  login,
  logout
}
