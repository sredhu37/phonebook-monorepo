const mongoose = require('mongoose');
const config = require('../utils/config');
const logger = require('../utils/logger');

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

const getContactSchema = () => {
  const Schema = mongoose.Schema;

  return new Schema({
    'name': {
      minlength: 3,
      type: String,
      required: true,
    },
    'number': {
      type: Number,
      length: 10,
      required: true,
    },
    'id': {
      minLength: 1,
      type: Number,
      required: true,
    },
  });
};

const getModel = (modelName, schema) => {
  try {
    const model = mongoose.model(modelName);
    return model;
  } catch (error) {
    return mongoose.model(modelName, schema);
  }
};

const addNewContact = (name, number, id) => {
  return new Promise((resolve, reject) => {
    connectToMongoDb()
        .then((response) => {
          const contactSchema = getContactSchema();
          const Contact = getModel('Contact', contactSchema);

          const contact = new Contact({
            'name': name,
            'number': number,
            'id': id,
          });

          return contact.save();
        })
        .then((response) => {
          mongoose.connection.close();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const getAllContacts = () => {
  return new Promise((resolve, reject) => {
    connectToMongoDb()
        .then((response) => {
          const contactSchema = getContactSchema();
          const Contact = getModel('Contact', contactSchema);

          return Contact.find({});
        })
        .then((response) => {
          mongoose.connection.close();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const searchContacts = ({name, number, id}) => {
  return new Promise((resolve, reject) => {
    connectToMongoDb()
        .then((response) => {
          const contactSchema = getContactSchema();
          const Contact = getModel('Contact', contactSchema);

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

          return Contact.find({
            $and: queryFilterArray,
          });
        })
        .then((response) => {
          if (response.length < 1) {
            logger.warn(`No matching result for the specified query: 
            {name: ${name}, number: ${number}, id: ${id}}!`);
          }
          mongoose.connection.close();
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
    connectToMongoDb()
        .then((response) => {
          const contactSchema = getContactSchema();
          const Contact = getModel('Contact', contactSchema);

          return Contact.deleteOne({id: id});
        })
        .then((response) => {
          mongoose.connection.close();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

const updateSingleContact = (id, {name, number}) => {
  return new Promise((resolve, reject) => {
    connectToMongoDb()
        .then((response) => {
          const contactSchema = getContactSchema();
          const Contact = getModel('Contact', contactSchema);

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
          return Contact.updateOne({id: id}, updatedProperties);
        })
        .then((response) => {
          mongoose.connection.close();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
  });
};

// Just testing some methods in this file

// getAllContacts()
//     .then((response) => {
//       logger.info(`GetAllContacts RESPONSE: ${response}`);
//     })
//     .catch((error) => {
//       logger.error(`GetAllContacts ERROR: ${error}`);
//     });

// addNewContact('dsfs', 67654, 334)
//     .then((response) => {
//       logger.info(`AddNewContact RESPONSE: ${response}`);
//     })
//     .catch((error) => {
//       logger.error(`AddNewContact ERROR: ${error}`);
//     });

// searchContacts({name: '', number: '', id: 189})
//     .then((response) => {
//       logger.info(`SearchContacts RESPONSE: ${response}`);
//     }).catch((error) => {
//       logger.error(`SearchContacts ERROR: ${error}`);
//     });

// getSingleContact(189)
// .then((response) => {
//   logger.info(`GetSingleContact RESPONSE: ${response}`);
// }).catch((error) => {
//   logger.error(`GetSingleContact ERROR: ${error}`);
// });

// deleteSingleContact(22323)
//     .then((response) => {
//       logger.info('DeleteSingleContact RESPONSE: ', response);
//     }).catch((error) => {
//       logger.error(`DeleteSingleContact ERROR: ${error}`);
//     });

// getSingleContactByName('abcd')
//     .then((response) => {
//       logger.info('GetContactsByName RESPONSE: ', response);
//     })
//     .catch((error) => {
//       logger.error(`GetContactsByName ERROR: ${error}`);
//     });

module.exports = {
  addNewContact,
  getAllContacts,
  searchContacts,
  getSingleContact,
  deleteSingleContact,
  getSingleContactByName,
  updateSingleContact,
};
