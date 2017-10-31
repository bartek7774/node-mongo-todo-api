let mongoose=require('mongoose');

let User = mongoose.model('Users', {
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  }
});

module.exports={User};