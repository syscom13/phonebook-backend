const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

let persons = [
    {
        name: 'Arto Hellas', 
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace', 
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov', 
        number: '12-43-234345',
        id: 3
    },
    {
        name: 'Mary Poppendieck', 
        number: '39-23-6423122',
        id: 4
    }
]

app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend</h1>')
})

app.get('/info', (req, res) => {
    const page = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`

    res.send(page)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    console.log(person)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*100000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const personExits = persons.some(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'Name or Number is missing'
        })
    }

    if (personExits) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    res.json(person)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})