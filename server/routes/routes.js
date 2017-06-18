const path = require('path')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const serverConfig = require('./../config')
const HomeController = require('./../controllers/home.controller')
const UserController = require('./../controllers/user.controller')
const ImageController = require('./../controllers/image.controller')
const messages = require('./../utilities/messages')
const auth = require('./../utilities/auth.js')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(serverConfig.rootPath, 'public', 'images'))
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage
  // fileFilter: (req, file, callback) => {
  //   let extension = path.extname(file.originalname)
  //   if (extension !== '.png' && extension !== '.jpg' && extension !== '.gif' && extension !== '.jpeg') {
  //     // return callback(null, false, new Error('Invalid mime type!'))
  //   }

  //   callback(null, true)
  // }
})

// HOME
router.route('/').get((req, res) => {
  HomeController.getHomePage(req, res)
})

router.route('/about').get((req, res) => {
  HomeController.getAboutPage(req, res)
})

// USER
router.route('/user/register').get((req, res) => {
  UserController.getRegisterPage(req, res)
})

router.route('/user/login').get((req, res) => {
  UserController.getLoginPage(req, res)
})

router.route('/user/register').post((req, res) => {
  UserController.register(req, res)
})

router.route('/user/login').post((req, res) => {
  UserController.login(req, res)
})

router.route('/user/logout').post((req, res) => {
  UserController.logout(req, res)
})

router.route('/profile/:username').get(auth.isAuthenticated, (req, res) => {
  UserController.getProfile(req, res)
})

// IMAGE
router.route('/image/add').get(auth.isAuthenticated, (req, res) => {
  ImageController.getAddImagePage(req, res)
})

router.route('/image/add').post(auth.isAuthenticated, upload.single('image'), (req, res) => {
  ImageController.addImage(req, res)
})

router.route('/tag/:tagName').get((req, res) => {
  ImageController.showByTag(req, res)
})

// GLOBAL
router.route('*').all((req, res, next) => {
  res.status('404')
  res.render('not-found', { message: messages.errors.notFound })
})

module.exports = router
