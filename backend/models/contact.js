const mongoose = require('mongoose');


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

module.exports = {
  getContactSchema,
  getModel,
};
