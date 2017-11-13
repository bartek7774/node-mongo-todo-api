const _ = require('lodash');
const expect = require('chai').expect;
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.equal(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text: 'Test todo text' }).then((todos) => {
          expect(todos.length).to.equal(1);
          expect(todos[0].text).to.equal(text);
          done();
        }).catch((e) => done(e));
      });
  });


  it('should not create a new todo from invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).to.equal(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.docs.length).to.equal(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should get todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).to.equal(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).to.equal(null);
          done();
        }).catch((e) => done(e));
      })

  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = `Updated text`;
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: true, text })
      .expect(200)
      .expect((res) => {
        let body = _.pick(res.body.todo, ['text', 'completed', 'completedAt']);
        expect(body.text).to.equal(text);
        expect(body.completed).to.equal(true);
      }).end(done);

  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = `Updated text !!!`;
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: false, text })
      .expect(200)
      .expect((res) => {
        let body = _.pick(res.body.todo, ['text', 'completed', 'completedAt']);
        expect(body.text).to.equal(text);
        expect(body.completed).to.equal(false);
        expect(body.completedAt).to.not.exist;
      }).end(done);

  });

});

describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).to.equal(users[0]._id.toHexString());
        expect(res.body.email).to.equal(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authentication', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).to.be.empty;
      })
      .end(done);
  });
});

describe('POST /user', () => {
  it('should create user', (done) => {
    let user = { email: 'new@gmail.com', password: 'abc123' };
    request(app)
      .post('/users')
      .send(user)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body.email).to.equal(user.email);
        expect(res.body._id).to.exist;
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({ email: user.email })
          .then((doc) => {
            expect(doc.email).to.equal(user.email);
            expect(doc.password).to.not.equal(user.password);
            expect(doc.tokens[0].token).to.exist;
            done();
          })
          .catch((err) => {
            return done(err);
          });
      });
  });
  it('sohould return validation errors if request invalid', (done) => {
    let user = { email: 'userThreeail.com', password: 'abc12' };
    request(app)
      .post('/users')
      .send({
        email: 'email.com',
        password: '123'
      })
      .expect(400)
      .end(done);
  });
  it('should not create user if email is use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'abc123'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return user auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body.email).to.equal(users[1].email);
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[1]._id).then((doc) => {
          expect(doc.tokens[0]).to.include({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid password', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'abc127'
      })
      .expect(404)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.exist;
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[1]._id).then((doc) => {
          expect(doc.tokens).to.have.lengthOf(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.exist;
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[0]._id).then((doc) => {
          expect(doc.tokens).to.have.lengthOf(0);
          done();
        }).catch((e) => done(e));
      });
  });
});