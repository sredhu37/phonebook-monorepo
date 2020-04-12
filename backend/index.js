const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const port = process.env.PORT || 3001;
const host = process.env.HOST || "http://127.0.0.1";

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

let persons = [
    {
        name: 'Tony Stark',
        number: '1234',
        id: 1
    },
    {
        name: 'Thor',
        number: '34343',
        id: 2
    },{
        name: 'Dr. Steven Strange',
        number: '45667',
        id: 3
    }
];

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.get('/api/persons', (req, res) => {
    res.send(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    const person = persons.find(person => person.id === id)
    if(person) {
        res.send(person)
    } else {
        res.sendStatus(404);
    }
});

app.get('/info', (req, res) => {
    let str = `Phonebook has info for ${persons.length} people<br/>`;
    str += Date();
    res.send(str)
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id)
    res.sendStatus(200);
});

app.post('/api/persons', (req, res) => {
    console.log("Received POST request in Backend!");
    const id = Math.floor(Math.random() * 10000);

    const body = req.body;

    if(body && body.name && body.number) {
        const newPerson = {
            name: body.name,
            number: body.number,
            id: id
        }

        const personAlreadyExists = persons.find(person => person.name === body.name);
        if(personAlreadyExists) {
            console.log("Name must be unique");
            res.status(400).send({ error: 'Name must be unique' });
        } else {
            persons.push(newPerson);
            console.log("Added new person.... Listing all persons: ", persons);
            res.status(200).send(newPerson);
        }
    } else {
        console.log("Wrong body in POST request!");
        res.status(400).send({ error: "Wrong body in POST request!" });
    }
});

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    let newName = '';
    let newNumber = '';

    if(body) {
        if(body.name) {
            newName = body.name;
        }

        if(body.number) {
            newNumber = body.number;
        }

        persons = persons.map(person => {
            console.log('Current person: ', person);
            if(person.id === id) {
                const obj = {
                    ...person,
                    name: newName ? newName : person.name,
                    number: newNumber ? newNumber : person.number
                };

                console.log(obj);

                return obj;
            } else {
                return person;
            }
        });

        res.send(persons);
    } else {
        res.status(400).send({ error: "Wrong body in PUT request!" });
    }
});


app.listen(port, () => {
    console.log(`Listening on ${host}:${port} ...`);
});
