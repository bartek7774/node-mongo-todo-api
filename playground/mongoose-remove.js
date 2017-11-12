const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then(({result})=>{
//   console.log(result);
// }).catch((e)=>{ console.log(e)});

// Todo.findOneAndRemove({_id:''}).then((todo)=>{
//   console.log(todo);
// });

Todo.findByIdAndRemove('59fb553ff9535f1d704618eb').then((todo)=>{
  console.log(todo);
});