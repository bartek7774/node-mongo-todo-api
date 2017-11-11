require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

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

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  }).catch(e => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  }).catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) return res.status(404).send();

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({ todo });
  }).catch((e) => res.status(404).send());

});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


module.exports = { app };
