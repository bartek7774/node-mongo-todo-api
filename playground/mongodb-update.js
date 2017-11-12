const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("59f70509635e15365766f26d")
  // }, {
  //     $set: {
  //       completed: false
  //     }
  //   }, {
  //     returnOriginal: false
  //   }).then((result) => {
  //     console.log(result);
  //     db.close();
  //   });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("59f7006f9f8c2b20f4ad81c0")
  }, {
      $set: {
        name: 'Bartek'
      },
      $inc:{
        age:2
      }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
      db.close();
    });


  // db.close();
});