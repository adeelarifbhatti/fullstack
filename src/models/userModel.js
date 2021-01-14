const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user','admin', 'poweruser'],
    default: 'user'
  },
  password: {
    type: String,
    requird: [ true, 'Please type your password'],
    minlength: 8,
    select: false
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
  currentStatus: {
    type: Boolean,
    default: true,
    select: false
  },
  passwordChanged: Date,
  resetToken: String,
  passwordResetExpires: Date
});
// checks if the password is being updated or not
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,12);
  this.passwordConfirm = undefined;
  next();
});
//
userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChanged = Date.now() - 1000;
  next();
});
userSchema.pre('find', function(next){
  this.find({currentStatus: {$ne:false}  });
  next();  
});
//checks if the passwordChanged exists,
// else no need to do comparison of dates
userSchema.methods.lastChangedPassword = function(JWTTimestamp){
  if(this.passwordChanged){
    const changedTimestamp = parseInt(this.passwordChanged.getTime() /1000,10);   
    console.log(changedTimestamp, "########### <<< ###########" ,JWTTimestamp); 
    console.log("TRUE or FALSE ####",JWTTimestamp < changedTimestamp);
  return (JWTTimestamp < changedTimestamp);
  }
  console.log("this.passwordChanged ", this.passwordChanged);
  return false;
};
userSchema.methods.checkPassword = async function(enteredPassword, userPassword){
  return await bcrypt.compare(enteredPassword,userPassword);
};

userSchema.methods.passwordResetToken = function(){
  const localResetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(localResetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10* 60 * 1000;
  console.log("From plocalResetToken#### ",localResetToken, "  and  ",this.resetToken," \n passwordResetExpires  "
    , this.passwordResetExpires);
  return localResetToken;

}
const User = mongoose.model('User',userSchema);

module.exports = User;
