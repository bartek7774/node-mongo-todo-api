const bcrypt=require('bcryptjs');


let password='abc123';
let prom1=new Promise((resolve,reject)=>{
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt).then((hash)=>{
      return resolve(hash);
    });
  });
}); 

let prom2=Promise.resolve(Promise.resolve(Promise.resolve(new Promise((resolve,reject)=>{
  return resolve(new Promise((resolve,reject)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        resolve(bcrypt.hash('123abc',salt));
    });
  }));
}))));
prom1.then((x)=>{
  console.log('test',x);
});
prom2.then((x)=>{
  console.log(x);
});