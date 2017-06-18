const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messages = require('./../utilities/messages')

const DESCRIPTION_MAX_LENGTH = 500

const imageSchema = new Schema({
  url: {
    type: String,
    required: messages.validator.propertyIsRequired
  },
  description: {
    type: String,
    maxlength: [DESCRIPTION_MAX_LENGTH, messages.validator.maxLength]
  },
  createdAt: {
    type: { type: Date, default: Date.now }
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Image', imageSchema)
