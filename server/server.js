const express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    let { errors: { text: { message: name } } } = e;
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((docs) => {
    res.send({ docs });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// GET /todos/1234
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id))  return res.status(404).send();
  
  Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch(e => res.status(400).send());
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = { app };
