const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  tweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User






/*

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
*/