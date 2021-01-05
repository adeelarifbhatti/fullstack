const mongoose = require('mongoose');

const userShema = new mongoose.schema({
  name: {
    type: String,
    required: [true, 'please enter the name']
  },
  email: {
    type: String,
    required: [true, 'please enter the email'],
    unique: true,
    lowercase: true,
    validate: [ validator.isEmail, 'please enter your email']
  },
  photo: String,
  password: {
    type: String,
    requird: [ true, 'Please type your password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password Confirmation']
  },
});
const User = mongoose.model('User',userSchema);

module.exports = User;
