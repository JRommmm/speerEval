
const mongoose = require('mongoose')

const mockSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },

})

mockSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('mockUser', mockSchema)