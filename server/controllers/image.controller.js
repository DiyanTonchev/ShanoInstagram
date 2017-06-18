const Image = require('./../models/image')

function getAddImagePage (req, res) {
  res.render('image/add')
}

function addImage (req, res) {
  let data = {
    description: req.body.description,
    user: req.user._id
  }

  if (req.file) {
    let filename = req.file.path.split(/[\\//]/g).pop()
    data.url = `images/${filename}`
  }

  let tagMatcher = /#[a-zA-z\d]+/gi
  if (tagMatcher.test(data.description)) {
    let tags = data.description.match(tagMatcher)
    data.tags = tags.filter((tag, index, tags) => { return tags.indexOf(tag) === index })
    data.tags.forEach((tag) => {
      data.description = data.description.replace(tag, `<a href="/tag/${tag.replace('#', '')}" >${tag}</a>`)
    })
  }

  Image.create(data)
    .then((savedImage) => {
      req.user.images.push(savedImage)
      req.user.save()
      res.redirect(302, '/')
    })
    .catch((err) => {
      console.error(err)
      let errors = err.errors
      let messages = []
      for (let currentError in errors) {
        messages.push(errors[currentError].message)
      }

      console.error(messages)
      res.locals.globalError = messages
      res.render('image/add')
    })
}

function showByTag (req, res) {
  let tag = `#${req.params.tagName}`
  Image
  .find({tags: { '$in': [tag] }})
  .sort('-createdAt')
  .limit(100)
  .then((images) => {
    res.render('image/imagesByTag', { tag, images })
  })
  .catch(err => res.status(500).send(err))
}

module.exports = {
  getAddImagePage,
  addImage,
  showByTag
}
