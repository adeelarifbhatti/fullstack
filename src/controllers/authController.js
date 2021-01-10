const { promisify } = require('util');
const crypto = require('crypto');
const Student = require('./../models/studentModel');
const tryCatch = require('./../lib/tryCatch');
const appErrors = require('./../lib/appErrors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendMail = require('./../lib/email');



const  signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
}
exports.signup = tryCatch( async (req,res,next) =>{
  const newStudent = await Student.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });
  const token = signToken(newStudent._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newStudent
    }
  });
});

exports.login = tryCatch(async(req,res,next) => {
  const { email, password } = req.body;
  //checking if email and password is there
  if (!email || !password) {
    return next(new appErrors('please enter the email and password',400));
  }
  // check if user/password is correct
  const currentStudent = await Student.findOne({email}).select('+password');
  if(!currentStudent || !(await currentStudent.checkPassword(password,currentStudent.password))){
    return next(new appErrors('please enter the email and password',401));
  }
  // Send token to the client
  console.log(currentStudent);
  const token= signToken(currentStudent._id);
  res.status(200).json({
    status:'success',
    token
  });
});

exports.secure = tryCatch(async(req, res,next) =>{
  let token;
  // check if Token is there, read it
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    if(!token) {
      return  next(new appErrors('Please login in order to get access',401));
    }

  //Verify the Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("Decoded.id   ",decoded.id);
  //check if student still exists
  const  currentStudent = await Student.findById(decoded.id);
  console.log(currentStudent)
  if(!currentStudent){
    return  next(new appErrors('The token doesnt belong to this user',401));
  };
  //check is student changed the password after sending the token
  if(currentStudent.lastChangedPassword(decoded.iat)){
  return next( new appErrors('Password has been recently changed, please login again', 401));
  }
  req.student = currentStudent;
  console.log(currentStudent);
  next();
});

exports.limitedTo =(...roles) => {
  return(req,res,next) => {
    // roles ['admin','poweruser']
    console.log("ROLES are  ",req.user.role);
    if(!roles.includes(req.user.role)){
      return next(new appErrors('You do not have the permission to delete the course', 403));

    }
    next();
  };
};
exports.lostPassword = tryCatch(async(req,res,next) =>{
  // User's email address in the posted body
  const student = await Student.findOne({email: req.body.email});
  if(!student){
    return next(new appErrors('This email is not registered for any student', 404));
  }

  // get created the ramdon reset token
  const resetToken = student.passwordResetToken();
  await student.save({validateBeforeSave: false});


  // send the link with the reset token to user's email
  const resetpasswordURL = `${req.protocol}://${req.get('host')}/api/v1/students/resetpassword/${resetToken}`;

  const message = `reset the password using this link ${resetpasswordURL}, after 15 minutes this link will be close`
  console.log("#####exports.lostPassword##### ",resetpasswordURL);
  try{
  await sendMail({
    email: student.email,
    subject: 'Your password reset link expiring in 15 minutes',
     message
  });
  res.status(200).json({
    status: 'success',
    message: 'Token is sent to email'
  });
} catch(err){
  student.resetToken =  undefined;
  student.passwordResetExpires = undefined;
  await student.save({validateBeforeSave: false});
  console.log("ERROR from CATCH   ",err);
  return next(new appErrors('A error was encountered while sending email', 500));

}

});
exports.resetPassword = tryCatch(async(req,res,next) => {
  
  // student based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  // if token has expired or not
  const student = await Student.findOne({resetToken: hashedToken,
                passwordResetExpires: {$gt: Date.now()}
                 });
  if(!student){
    return next(new appErrors('Something is wrong with the Token', 400));
  
  }
  console.log("###PASSWORD  ",req.body.password, "  confirm ",req.body);
  student.password = req.body.password;
  student.passwordConfirm = req.body.passwordConfirm;
  student.resetToken = undefined;
  student.passwordResetExpires = undefined;
  await student.save();

  // update passwordChanged property for the user &
  //login Student send JWT
  const token = signToken(student._id);
  res.status(200).json({
    status: 'success',
    token
  });

  });

exports.updatePassword = tryCatch(async (req, res, next) => {
console.log("inside ###################### updatePassword");
  console.log(req.student.id);
  // find student from collection
  const student = await Student.findById(req.student.id).select('+password');

  // check if the password typed is correct
  if(!(await student.checkPassword(req.body.currentPassword, student.password))){
    return next(new appErrors('Current password is not correct',401));
  }

  // update the password
  student.password = req.body.password;
  student.passwordConfirm = req.body.passwordConfirm;
  // can not use the findByIDAndUpdate because password and confirm password validation wud not work
  await student.save();

  // send JWT for signing in user
  const token = signToken(student._id);
  res.status(200).json({
    status: 'success',
    token
  });


});
