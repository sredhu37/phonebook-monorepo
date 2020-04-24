const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + './../.env'});

// MongoDb atlas account: redhu.sunny1994@gmail.com/I with @
// DB name: phonebook
// Username: read-write
// Password: read-write

const connectToMongoDb = (clusterName, dbName) => {
  return new Promise((resolve, reject) => {
    const username = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    // console.log(`__dirname: ${__dirname}
    //  User: ${username}; Password: ${password}`);

    if (!(username && password)) {
      const resultMessage = `
    Unable to find username or password for MongoDB connection...
    Please set MONGO_USER and MONGO_PASSWORD environment variables properly!
        `;
      // console.log(resultMessage);
      reject(resultMessage);
    }

    const connectionString = `mongodb+srv://${username}:${password}@${clusterName}-x5vx1.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    console.log(`ConnectionString: ${connectionString}`);

    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((response) => {
      const resultMessage = `Successfully connected to MongoDB: ${response}`;
      // console.log(resultMessage);
      resolve(resultMessage);
    }).catch((error) => {
      const resultMessage = `ERROR: Unable to connect to MongoDB!: ${error}`;
      // console.log(resultMessage);
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
      required: true
    },
    'number': {
      type: Number,
      length: 10,
      required: true
    },
    'id': {
      minLength: 1,
      type: Number,
      required: true
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
    const clusterName = 'phonebook';
    const dbName = 'Phonebook';

    connectToMongoDb(clusterName, dbName)
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
    const clusterName = 'phonebook';
    const dbName = 'Phonebook';

    connectToMongoDb(clusterName, dbName)
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
    const clusterName = 'phonebook';
    const dbName = 'Phonebook';
    connectToMongoDb(clusterName, dbName)
        .then((response) => {
          const contactSchema = getContactSchema();
          const Contact = getModel('Contact', contactSchema);

          const queryFilterArray = [];
          if (id) {
            console.log(`Including id: ${id} in the searchQuery.`);
            queryFilterArray.push({id: id});
          }
          if (name) {
            console.log(`Including name: ${name} in the searchQuery.`);
            queryFilterArray.push({name: name});
          }
          if (number) {
            console.log(`Including number: ${number} in the searchQuery.`);
            queryFilterArray.push({number: number});
          }

          return Contact.find({
            $and: queryFilterArray,
          });
        })
        .then((response) => {
          if (response.length < 1) {
            console.log(`No matching result for the specified query: 
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
    const clusterName = 'phonebook';
    const dbName = 'Phonebook';
    connectToMongoDb(clusterName, dbName)
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
    const clusterName = 'phonebook';
    const dbName = 'Phonebook';

    connectToMongoDb(clusterName, dbName)
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

          // console.log('name: ', name);
          // console.log('number: ', number);
          // console.log('UpdatedProperties: ', updatedProperties);
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
//       console.log(`GetAllContacts RESPONSE: ${response}`);
//     })
//     .catch((error) => {
//       console.log(`GetAllContacts ERROR: ${error}`);
//     });

// addNewContact('dsfs', 67654, 334)
//     .then((response) => {
//       console.log(`AddNewContact RESPONSE: ${response}`);
//     })
//     .catch((error) => {
//       console.log(`AddNewContact ERROR: ${error}`);
//     });

// searchContacts({name: '', number: '', id: 189})
//     .then((response) => {
//       console.log(`SearchContacts RESPONSE: ${response}`);
//     }).catch((error) => {
//       console.log(`SearchContacts ERROR: ${error}`);
//     });

// getSingleContact(189)
// .then((response) => {
//   console.log(`GetSingleContact RESPONSE: ${response}`);
// }).catch((error) => {
//   console.log(`GetSingleContact ERROR: ${error}`);
// });

// deleteSingleContact(22323)
//     .then((response) => {
//       console.log('DeleteSingleContact RESPONSE: ', response);
//     }).catch((error) => {
//       console.log(`DeleteSingleContact ERROR: ${error}`);
//     });

// getSingleContactByName('abcd')
//     .then((response) => {
//       console.log('GetContactsByName RESPONSE: ', response);
//     })
//     .catch((error) => {
//       console.log(`GetContactsByName ERROR: ${error}`);
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
