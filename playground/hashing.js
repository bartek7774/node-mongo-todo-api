const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

let password='abc123';
bcrypt.genSalt(10,(err,salt)=>{
  // bcrypt.hash(password,salt,(err,hash)=>{
  //   console.log(hash);
  // });
  bcrypt.hash(password,salt).then((hash)=>{
    console.log(hash);
  });
});

let hashedPassword='$2a$10$9U9btHCV8DcA9omacXUsd.A5atcvzSFTjSIji/QoPGkVr3.IrKqie';

bcrypt.compare(password,hashedPassword).then((res)=>{
  console.log(res);
});

// let data={
//   id:10
// };

// let token=jwt.sign(data,'123abc');
// console.log(token);

// let decoded=jwt.verify(token,'123abc');
// console.log(decoded);
/*
let message='I am user number 3';

let hash=SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data={
  id:4
};

let token={
  data,
  hash:SHA256(JSON.stringify(data)+'secret').toString()
}

// token.id=5;
// token.hash=SHA256(JSON.stringify(data)).toString();


let resutHash=SHA256(JSON.stringify(token.data)+'secret').toString();

if(resutHash===token.hash){
  console.log('Data was not changed');
} else{
  console.log('Data was changed. Do not trust!');
}
*/