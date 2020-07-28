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


app.get('/info', async (req, res) => {
    const count = await Person.countDocuments({})
    res.send(`<p>There are ${count} contacts in your phonebook</p>`)
})

app.get('/api/persons', async (req, res, next) => {
    try {
        const people = await Person.find({})

        if (people) {
            res.json(people)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

app.get('/api/persons/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id)

        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/api/persons/:id', async (req, res, next) => {
    try {
        await Person.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})


app.post('/api/persons', async (req, res, next) => {
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
        next(error)
    }
})

app.put('/api/persons/:id', async (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    try {
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, person, { runValidators:true, new: true, context: 'query' })
        res.json(updatedPerson)
    } catch (error) {
        next(error)
    }
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError' || error.name === 'ReferenceError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})