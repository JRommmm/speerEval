const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 140
  },
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

tweetSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Tweet', tweetSchema)