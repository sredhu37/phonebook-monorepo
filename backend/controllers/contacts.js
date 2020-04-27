const express = require('express');
const contactsRouter = new express.Router();
const Contact = require('../models/contact');
const logger = require('../utils/logger');

contactsRouter.get('/', (req, res) => {
  Contact.getAllContacts().then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

contactsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  Contact.getSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

contactsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  Contact.deleteSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

contactsRouter.post('/', (req, res) => {
  logger.info('Received POST request in Backend!');
  const id = Math.floor(Math.random() * 100000);

  const body = req.body;

  if (body && body.name && body.number) {
    Contact.getSingleContactByName(body.name)
        .then((response) => {
          if (response.length < 1) {
            logger.info('Trying to add new contact...');
            return Contact.addNewContact(body.name, body.number, id);
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

contactsRouter.put('/:id', (req, res) => {
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

    Contact.updateSingleContact(id, {name: newName, number: newNumber})
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

module.exports = contactsRouter;
