const mongoose = require('mongoose')
const Schema = mongoose.Schema
const encryption = require('./../utilities/encryption')
const messages = require('./../utilities/messages')

const USERNAME_MIN_LENGTH = 3
// const PASSWORD_PATTERN = [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/, messages.validator.user.password]
const AGE_MIN_VALUE = 0
const AGE_MAX_VALUE = 120
const GENDERS = { values: ['Male', 'Female'], message: messages.validator.user.gender }
const ROLES = { values: ['Admin', 'User'], message: messages.validator.user.role }

const userSchema = new Schema({
  username: {
    type: String,
    minlength: [USERNAME_MIN_LENGTH, messages.validator.minLength],
    required: messages.validator.propertyIsRequired,
    unique: true
    // lowercase: true
  },
  password: {
    type: String,
    // match: PASSWORD_PATTERN,
    required: messages.validator.propertyIsRequired
  },
  salt: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: messages.validator.propertyIsRequired
  },
  lastName: {
    type: String,
    required: messages.validator.propertyIsRequired
  },
  age: {
    type: Number,
    min: [AGE_MIN_VALUE, messages.validator.user.ageInterval],
    max: [AGE_MAX_VALUE, messages.validator.user.ageInterval]
  },
  gender: {
    type: String, enum: GENDERS
  },
  roles: [{
    type: String,
    enum: ROLES,
    default: 'User'
  }],
  images: [{ type: Schema.Types.ObjectId, ref: 'Image' }]
})

userSchema.methods.authenticate = function (password) {
  let hashedPassword = encryption.generateHashedPassword(this.salt, password)
  return hashedPassword === this.password
}

let User = mongoose.model('User', userSchema)
module.exports = User
module.exports.seedAdminUser = () => {
  User
    .find()
    .then((users) => {
      if (users.length > 0) {
        return
      }

      let salt = encryption.generateSalt()
      let hashedPassword = encryption.generateHashedPassword(salt, 'aDm1n@77')
      User.create({
        username: 'admin',
        password: hashedPassword,
        salt: salt,
        firstName: 'Admin',
        lastName: 'Admin',
        roles: 'Admin'
      })
        .catch(console.error)
    })
}
