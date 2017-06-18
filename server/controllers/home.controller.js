const Image = require('./../models/image')

function getHomePage (req, res) {
  Image
    .find()
    .limit(100)
    .sort('-createdAt')
    .then((images) => {
      res.render('home/index', { images })
    })
    .catch(err => res.status(500).send(err))
}

function getAboutPage (req, res) {
  res.render('home/about')
}

module.exports = {
  getHomePage,
  getAboutPage
}
