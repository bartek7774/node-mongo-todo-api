const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');

let UserSchema=new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique:true,
    validate: function(val) {
      return new Promise(function(resolve, reject) {
        resolve(validator.isEmail(val));
      });
    }
    // validate:{
    //   validator:validator.isEmail,
    //   message:'{VALUE} is not valid email'
    // }
  },
  password:{
    type:String,
    require:true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      require:true
    }
  }]
});

UserSchema.methods.toJSON=function(){
  let user=this;
  let userObject=user.toObject();
  return _.pick(userObject,['email','_id']);
};

UserSchema.methods.generateAuthToken=function(){
  let user=this;
  let access='auth';
  let token=jwt.sign({_id: user._id.toHexString(),access},'abc123').toString();
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  });
}

let User = mongoose.model('Users', UserSchema);

module.exports={User};