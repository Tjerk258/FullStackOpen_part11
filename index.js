require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook.js')
const app = express()
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// const generateId = () => {
//     let id
//     do {
//         id = Math.round(Math.random() * 1000)
//     } while (persons.find(person => person.id === id))
//     return id
// }

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(phonebook => {
    response.json(phonebook)
  })
  // response.json(persons);
})

app.get('/api/info', (request, response) => {
  Phonebook.find({}).then(phonebook => {
    response.send(`<div>Phonebook has info for ${phonebook.length} people <br/><br/> ${new Date()}</div>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
    response.json(note)
  }).catch(error => next(error))

  // const id = Number(request.params.id);
  // const person = persons.find(person => person.id === id);

  // if (person) {
  //     response.json(person);
  // } else {
  //     response.status(404).end();
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Phonebook({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPhonebook => {
    response.json(savedPhonebook)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const phonebook = {
    name: body.name,
    number: body.number,
  }

  Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})