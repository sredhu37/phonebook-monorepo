const express = require('express');
const contactService = require('./models/contact');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');

const port = config.APPLICATION_PORT;
const host = config.APPLICATION_HOST;

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());


app.get('/', (req, res) => {
  res.send('Congrats... This page seems to be working fine!');
});

app.get('/api/persons', (req, res) => {
  contactService.getAllContacts().then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  contactService.getSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

app.get('/info', (req, res) => {
  contactService.getAllContacts().then((response) => {
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

  contactService.deleteSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

app.post('/api/persons', (req, res) => {
  logger.info('Received POST request in Backend!');
  const id = Math.floor(Math.random() * 100000);

  const body = req.body;

  if (body && body.name && body.number) {
    contactService.getSingleContactByName(body.name)
        .then((response) => {
          if (response.length < 1) {
            logger.info('Trying to add new contact...');
            return contactService.addNewContact(body.name, body.number, id);
          } else {
            res.status(400).send({error: `Person with name: 
        ${body.name} already exists!`, count: response.length});
          }
        })
        .then((response) => {
          logger.info('Contact added successfully!');
          res.status(200).send(response);
        })
        .catch((error) => {
          res.send(error);
        });
  } else {
    logger.error('Wrong body in POST request!');
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

    contactService.updateSingleContact(id, {name: newName, number: newNumber})
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
  logger.info(`Listening on ${host}:${port} ...`);
});
