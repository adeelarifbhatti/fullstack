const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
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
    required: [true, 'Password Confirmation'],
    validate: {
      validator: function(el){
        return el === this.password;
      },
      message: "Passwords do not match"
    }
  },
});
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,12);
  this.passwordConfirm = undefined;
  next();
});
const Student = mongoose.model('Student',userSchema);

module.exports = Student;
