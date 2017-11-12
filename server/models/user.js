const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique: true,
    validate: function (val) {
      return new Promise(function (resolve, reject) {
        resolve(validator.isEmail(val));
      });
    }
    // validate:{
    //   validator:validator.isEmail,
    //   message:'{VALUE} is not valid email'
    // }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  return _.pick(userObject, ['email', '_id']);
};

UserSchema.statics.findByToken = function (token) {
  let UserModel = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }
  return UserModel.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email })
    .then((user) => {
      if (!user) return Promise.reject();

      return bcrypt.compare(password, user.password).then((result) => {
        if (!result) return Promise.reject();
        return Promise.resolve(user);
      });

      /*
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return reject();
          bcrypt.hash(password, salt).then((hash) => {
            bcrypt.compare(password,hash).then((res)=>{
              if(!res) return reject();
              return resolve(user);  
            });
          });
        });
      });*/
    
    });
}

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
  user.tokens.push({ access, token });
  return user.save().then(() => {
    return token;
  });
}

UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt).then((hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('Users', UserSchema);

module.exports = { User };