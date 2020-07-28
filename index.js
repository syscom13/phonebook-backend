require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', async (req, res) => {
    try {
        const people = await Person.find({})
        res.json(people)
    } catch (error) {
        res.status(404).end()
    }
})

app.get('/api/persons/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id)
        res.json(person)
    } catch (error) {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})


app.post('/api/persons', async (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'Name or Number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    try {
        const savedPerson = await person.save()
        res.json(savedPerson)
    } catch (error) {
        console.log(error)
    }
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})