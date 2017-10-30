let mongoose=require('mongoose');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp',{
  useMongoClient:true
});

let Todo=mongoose.model('Todo',{
  text:{
    type:String
  },
  completed:{
    type:Boolean
  },
  completedAt:{
    type:Number
  }
});

let newTodo=new Todo({
  text:'Cook dinner'
});

let newTodo2=new Todo({
  text:'Eat launch',
  completed:false,
  completedAt:-1
});

newTodo2.save().then((doc)=>{
  // console.log('Save todo ',doc);
  console.log(JSON.stringify(doc,undefined,2));
},(e)=>{
  console.log('Unable to save todo');
});