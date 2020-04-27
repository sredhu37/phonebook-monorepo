// const logger = require('./logger');
require('dotenv').config({path: __dirname + '/../.env'});

const localhost = 'http://127.0.0.1';

const NODE_ENV = process.env.NODE_ENV || 'PROD';
const APPLICATION_PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
let APPLICATION_HOST = process.env.HOST || localhost;

if (NODE_ENV === 'DEV') {
  APPLICATION_HOST = localhost;
}

// logger.info(`PORT: ${APPLICATION_PORT}
//     HOST: ${APPLICATION_HOST}
//     NODE_ENV: ${NODE_ENV}
//     MONGO_USER: ${MONGO_USER}
//     MONGO_PASSWORD: ${MONGO_PASSWORD}
// `)

module.exports = {
  APPLICATION_HOST,
  APPLICATION_PORT,
  MONGO_URI,
  NODE_ENV,
};
