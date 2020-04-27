const express = require('express');
const contactsRouter = new express.Router();
const mongoose = require('mongoose');
const ContactModule = require('../models/contact');
const logger = require('../utils/logger');
const config = require('../utils/config');


// Helper methods begin here-------------------------------

// MongoDb atlas account: redhu.sunny1994@gmail.com/I with @
// DB name: phonebook
// Username: read-write
// Password: read-write

const connectToMongoDb = () => {
  return new Promise((resolve, reject) => {
    const mongoUri = config.MONGO_URI;
    // logger.info(`mongoUri: ${mongoUri}`);

    if (!(mongoUri)) {
      const resultMessage = `
    Unable to find mongoUri for MongoDB connection...
    Please set MONGO_URI environment variable properly!
        `;
      // logger.error(resultMessage);
      reject(resultMessage);
    }

    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((response) => {
      const resultMessage = `Successfully connected to MongoDB: ${response}`;
      // logger.info(resultMessage);
      resolve(resultMessage);
    }).catch((error) => {
      const resultMessage = `ERROR: Unable to connect to MongoDB!: ${error}`;
      logger.error(resultMessage);
      reject(resultMessage);
    });
  });
};

const addNewContact = (name, number, id) => {
  return new Promise((resolve, reject) => {
    const contactSchema = ContactModule.getContactSchema();
    const Contact = ContactModule.getModel('Contact', contactSchema);

    const contact = new Contact({
      'name': name,
      'number': number,
      'id': id,
    });

    contact.save()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const getAllContacts = () => {
  return new Promise((resolve, reject) => {
    const contactSchema = ContactModule.getContactSchema();
    const Contact = ContactModule.getModel('Contact', contactSchema);

    Contact.find({})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const searchContacts = ({name, number, id}) => {
  return new Promise((resolve, reject) => {
    const contactSchema = ContactModule.getContactSchema();
    const Contact = ContactModule.getModel('Contact', contactSchema);

    const queryFilterArray = [];
    if (id) {
      logger.info(`Including id: ${id} in the searchQuery.`);
      queryFilterArray.push({id: id});
    }
    if (name) {
      logger.info(`Including name: ${name} in the searchQuery.`);
      queryFilterArray.push({name: name});
    }
    if (number) {
      logger.info(`Including number: ${number} in the searchQuery.`);
      queryFilterArray.push({number: number});
    }

    Contact.find({
      $and: queryFilterArray,
    })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });

    Contact.find({})
        .then((response) => {
          if (response.length < 1) {
            logger.warn(`No matching result for the specified query: 
          {name: ${name}, number: ${number}, id: ${id}}!`);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const getSingleContact = (id) => {
  return searchContacts({name: '', number: '', id: id});
};

const getSingleContactByName = (name) => {
  return searchContacts({name: name, number: '', id: ''});
};

const deleteSingleContact = (id) => {
  return new Promise((resolve, reject) => {
    const contactSchema = ContactModule.getContactSchema();
    const Contact = ContactModule.getModel('Contact', contactSchema);

    Contact.deleteOne({id: id})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const updateSingleContact = (id, {name, number}) => {
  return new Promise((resolve, reject) => {
    const contactSchema = ContactModule.getContactSchema();
    const Contact = ContactModule.getModel('Contact', contactSchema);

    const updatedProperties = {};
    if (name) {
      updatedProperties.name = name;
    }
    if (number) {
      updatedProperties.number = number;
    }

    // logger.info('name: ', name);
    // logger.info('number: ', number);
    // logger.info('UpdatedProperties: ', updatedProperties);

    Contact.updateOne({id: id}, updatedProperties)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

// Helper methods end here---------------------------------


contactsRouter.get('/', (req, res) => {
  getAllContacts().then((response) => {
    res.send(response);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

contactsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  getSingleContact(id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
});

contactsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  deleteSingleContact(id)
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
    getSingleContactByName(body.name)
        .then((response) => {
          if (response.length < 1) {
            logger.info('Trying to add new contact...');
            return addNewContact(body.name, body.number, id);
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

    updateSingleContact(id, {name: newName, number: newNumber})
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

module.exports = {
  connectToMongoDb,
  contactsRouter,
};
