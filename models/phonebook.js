const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be 3 characters long'],
    required: [true, 'name is required']
  },
  number: {
    type: String,
    minLength: [8, 'number must be 8 numbers long'],
    validate: {
      validator: v => /^(\d{2,3})-(\d+)$/.test(v),
      message: props => `${props.value} is not a valid phone number, use format <123-45678> or <12-345678>`
    },
    required: [true, 'Phone number required']
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)