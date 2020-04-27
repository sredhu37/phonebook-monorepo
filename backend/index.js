const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const {connectToMongoDb, contactsRouter} = require('./controllers/contacts');
const rootRouter = require('./controllers/root');


const port = config.APPLICATION_PORT;
const host = config.APPLICATION_HOST;

connectToMongoDb()
    .then((response) => {
      logger.info('Connected successfully to MongoDB: ', response);
    })
    .catch((error) => {
      logger.error('ERROR: some issue while connecting to MongoDB: ', error);
    });

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use('/', rootRouter);
app.use('/api/persons', contactsRouter);

app.listen(port, () => {
  logger.info(`Listening on ${host}:${port} ...`);
});
