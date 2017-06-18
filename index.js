/**
 * Entry Script
 */

// require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
  // TODO
} else {
  require('./server/server')
}
