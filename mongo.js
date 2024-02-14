const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Freestack:${encodeURI(password)}@cluster0.0h8ildb.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const phonebook = new Phonebook({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length < 4) {
  console.log('phonebook:')
  Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
      console.log(phonebook.name, phonebook.number)
    })
    mongoose.connection.close()
  })
} else {
  phonebook.save().then(() => {
    console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}