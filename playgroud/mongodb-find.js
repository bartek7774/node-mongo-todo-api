const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find(
  //     {_id:new ObjectID('59f70509635e15365766f26d')}
  //   ).toArray()
  //   .then((docs)=>{
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs,undefined,2));
  //     db.close();
  //   },(err)=>{
  //     console.log('Unable to fetch todos',err);
  //   });

  // db.collection('Todos').find().count()
  // .then((count)=>{
  //   console.log(`Todos count ${count}`);
  //   db.close();
  // },(err)=>{
  //   console.log('Unable to fetch todos',err);
  // });

  db.collection('Users').find({name:'Bartek'}).toArray()
  .then((docs)=>{
    // console.log(`Users count ${count}`);
    console.log(JSON.stringify(docs,undefined,2));
    db.close();
  },(err)=>{
    console.log('Unable to fetch todos',err);
  });

  // db.close();
});