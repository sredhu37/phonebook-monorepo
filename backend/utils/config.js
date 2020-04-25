// const logger = require('./logger');
require('dotenv').config({path: __dirname + '/../.env'});

const localhost = 'http://127.0.0.1';

const ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';
const APPLICATION_PORT = process.env.PORT || 3001;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
let APPLICATION_HOST = process.env.HOST || localhost;

if (ENVIRONMENT === 'DEV') {
  APPLICATION_HOST = localhost;
}

// logger.info(`PORT: ${APPLICATION_PORT}
//     HOST: ${APPLICATION_HOST}
//     ENVIRONMENT: ${ENVIRONMENT}
//     MONGO_USER: ${MONGO_USER}
//     MONGO_PASSWORD: ${MONGO_PASSWORD}
// `)

module.exports = {
  APPLICATION_HOST,
  APPLICATION_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  ENVIRONMENT,
};
