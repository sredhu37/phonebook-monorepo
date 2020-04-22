const express = require('express');
const mongoService = require('./services/mongoService');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config({path: __dirname + '/.env'});

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'http://127.0.0.1';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

// MongoDb atlas account: redhu.sunny1994@gmail.com/I with @
// DB name: phonebook
// Username: read-write
// Password: read-write
// Connection String: mongodb+srv://read-write:<password>@phonebook-x5vx1.mongodb.net/test?retryWrites=true&w=majority
// const persons = [
//   {
//     name: 'Tony Stark',
//     number: '1234',
//     id: 1,
//   },
//   {
//     name: 'Thor',
//     number: '34343',
//     id: 2,
//   }, {
//     name: 'Dr. Steven Strange',
//     number: '45667',
//     id: 3,
//   },
// ];

app.get('/', (req, res) => {
  res.send('Congrats... This page seems to be working fine!');
});

app.get('/api/persons', (req, res) => {
  mongoService.getAllContacts().then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  mongoService.getSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

app.get('/info', (req, res) => {
  mongoService.getAllContacts().then((response) => {
    const numOfContacts = response.length;
    let str = `Phonebook has info for ${numOfContacts} people<br/>`;
    str += Date();
    res.send(str);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  mongoService.deleteSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

app.post('/api/persons', (req, res) => {
  console.log('Received POST request in Backend!');
  const id = Math.floor(Math.random() * 100000);

  const body = req.body;

  if (body && body.name && body.number) {
    mongoService.getSingleContactByName(body.name)
        .then((response) => {
          if (response.length < 1) {
            console.log('Trying to add new contact...');
            return mongoService.addNewContact(body.name, body.number, id);
          } else {
            res.status(400).send({error: `Person with name: 
        ${body.name} already exists!`, count: response.length});
          }
        })
        .then((response) => {
          console.log('Contact added successfully!');
          res.status(200).send(response);
        })
        .catch((error) => {
          res.send(error);
        });
  } else {
    console.log('Wrong body in POST request!');
    res.status(400).send({error: 'Wrong body in POST request!'});
  }
});

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  let newName = '';
  let newNumber = '';

  if (body) {
    if (body.name) {
      newName = body.name;
    }

    if (body.number) {
      newNumber = body.number;
    }

    mongoService.updateSingleContact(id, {name: newName, number: newNumber})
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          res.status(400)
              .send({error: `Couldn't update the contact: ${error}`});
        });
  } else {
    res.status(400).send({error: 'Wrong body in PUT request!'});
  }
});


app.listen(port, () => {
  console.log(`Listening on ${host}:${port} ...`);
});
