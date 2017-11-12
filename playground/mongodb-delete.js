const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({text:'Eat launch'})
  //   .then((result)=>{
  //     console.log(result);
  //     db.close();
  //   });

  //deleteOne
  // db.collection('Todos').deleteOne({text:'Eat launch'})
  // .then(({result})=>{
  //   console.log(result);
  //   db.close();
  // });

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed:false})
  // .then((result)=>{
  //   console.log(result);
  //   db.close();
  // });

  // db.collection('Users').deleteMany({name:'Bartek'})
  // .then(({result})=>{
  //   console.log(result);
  //   db.close();
  // });

  db.collection('Users').findOneAndDelete({_id:new ObjectID("59f6fd91efe5a93b7cfce7b5")})
  .then((result)=>{
    console.log(result);
    db.close();
  });

  // db.close();
});