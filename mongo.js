const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length > 3 &&  process.argv.length !== 5 ) {
    console.log('Please provide the correct number or arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nicolas:${password}@cluster0.myzcb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

const Person = mongoose.model('Person', personSchema)

const listPeople = () => {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}

const createPerson = (name, number) => {
    const person = new Person({ name, number })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    listPeople()
}

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    createPerson(name, number)
}






