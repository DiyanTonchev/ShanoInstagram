const path = require('path')

const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/shano-instagram',
  port: process.env.PORT || 1001,
  rootPath: path.join(__dirname, '../')
}

module.exports = config
