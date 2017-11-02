const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(encodeURI('mongodb://bartex:Yeti777%@ds245715.mlab.com:45715/todo_app'), {
  useMongoClient: true
})
.then(function (db) {
  console.log('Connection established');
});

module.exports = { mongoose };