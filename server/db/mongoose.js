const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL?encodeURI(process.env.MONGO_URL):'mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
})
.then(function (db) {
  console.log('Connection established');
});

module.exports = { mongoose };