const express=require('express');
const bodyParser=require('body-parser');

let {mongoose}=require('./db/mongoose');
let {User}=require('./models/user');
let {Todo}=require('./models/todo');

const app=express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  
  let todo=new Todo({
    text:req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    let {errors:{text:{message:name}}}=e;
    // console.log(name);
    res.status(400).send(e);
  });
});

app.listen(3000,()=>{
  console.log('Started on port 3000');
});

module.exports={app};
