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

app.post('/todos', authenticate, (req, res) => {

  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    let { errors: { text: { message: name } } } = e;
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((docs) => {
    res.send({ docs });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  }).catch(e => res.status(400).send());
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  try {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) throw new Error(404);
    let todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
    if (!todo) {
      throw new Error(404);
    }
    res.send({ todo });
  } catch (e) {
    res.status(e.message).send();
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) return res.status(404).send();

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) return res.status(404).send();
      res.send({ todo });
    }).catch((e) => res.status(404).send());

});

app.post('/users', async (req, res) => {
  try {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    await user.save();
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
  // user.save()
  //   .then(() => {
  //     return user.generateAuthToken();
  //   })
  //   .then((token) => {
  //     res.header('x-auth', token).send(user);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    let { email, password } = _.pick(req.body, ['email', 'password']);
    let user = await User.findByCredentials(email, password);
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


module.exports = { app };
