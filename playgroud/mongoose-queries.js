const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// let id='59f8b303a9dc4434dc156584';

// if(!ObjectID.isValid(id)){
//   console.log('Id is not valid');
// }

// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log('Todos',todos);
// });

// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log('Todo',todo);
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('Id not found.')
//   }
//   console.log('Todo',todo);
// }).catch((e)=>console.log(e));

let id='59f7750d2443490830397211';

if (!ObjectID.isValid(id)) {
  console.log('Id is not valid.');
} else {
  User.findById(id).then((user) => {
    if (!user) {
      return console.log('Id not found.')
    }
    console.log('User', JSON.stringify(user,undefined,2));
  }).catch((e) => console.log(e));
}