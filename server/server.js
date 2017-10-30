let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

let newTodo = new Todo({
  text: 'true'
});

// newTodo.save().then((doc)=>{
//   // console.log('Save todo ',doc);
//   console.log(JSON.stringify(doc,undefined,2));
// },(e)=>{
//   console.log('Unable to save todo ',e);
// });


let User = mongoose.model('Users', {
  email: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  }
});

let user1 = new User({
  email: '  beka@cosm.pl'
});


user1.save().then(({email:doc}) => {
  console.log('User saved ',doc);
}, (e) => {
  console.log('Unable to save user', e);
});