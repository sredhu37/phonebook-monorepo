const express = require('express');
const rootRouter = new express.Router();
const Contact = require('../models/contact');
// const logger = require('../utils/logger');

rootRouter.get('/', (req, res) => {
  res.send('Congrats... This page seems to be working fine!');
});

rootRouter.get('/info', (req, res) => {
  Contact.getAllContacts().then((response) => {
    const numOfContacts = response.length;
    let str = `Phonebook has info for ${numOfContacts} people<br/>`;
    str += Date();
    res.send(str);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

module.exports = rootRouter;
