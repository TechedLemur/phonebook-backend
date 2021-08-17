const mongoose = require('mongoose')
const dbName = "phonebook-app"


if (process.argv.length < 5 && process.argv.length != 3) {
    console.log('Please provide the password, name and phonenumber as arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]


const url =
    `mongodb+srv://fullstack:${password}@cluster0.x9lxg.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`Added ${name}, number: ${number} to the phonebook.`)
        mongoose.connection.close()
    })
}