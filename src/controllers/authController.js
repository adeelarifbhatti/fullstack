const { promisify } = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
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
const sendToken =(user,statusCode,res) =>{
  const cookieProperties = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000), 
    httpOnly: true 
  };
  if (process.env.NODE_ENV==='development') cookieProperties.secure=true;
  const token = signToken(user._id);
  res.cookie('jwt', token, cookieProperties);
  // to remove the password so it doesn't appear in the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user
    }

  });
};
exports.signup = tryCatch( async (req,res,next) =>{
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });
  sendToken(newUser,200,res);
 /* const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser
    }
  }); */
});
exports.login = tryCatch(async(req,res,next) => {
  const { email, password } = req.body;
  //checking if email and password is there
  if (!email || !password) {
    return next(new appErrors('please enter the email and password',400));
  }
  // check if user/password is correct
  const currentUser = await User.findOne({email}).select('+password');
  if(!currentUser || !(await currentUser.checkPassword(password,currentUser.password))){
    return next(new appErrors('please enter the email and password',401));
  }
  // Send token to the client
  console.log("Inside login   ",currentUser);
  sendToken(currentUser,200,res);
});
exports.secure = tryCatch(async(req, res,next) =>{
  let token;
  // check if Token is there in authhrization, read it
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    }
    //Following checks of the cookies.jwt exist in the header if authorization header doesn't have token
    else if(req.cookies.jwt){
      token = req.cookies.jwt
    }
    console.log(token);
    if(!token) {
      return  next(new appErrors('Please login in order to get access',401));
    }
  //Verify the Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("Decoded.id   ",decoded.id);
  //check if user still exists
  const  currentUser = await User.findById(decoded.id);
  console.log("Inside secure    ",currentUser)
  if(!currentUser){
    return  next(new appErrors('The token doesnt belong to this user',401));
  };
  //check is user changed the password after sending the token
  if(currentUser.lastChangedPassword(decoded.iat)){
  return next( new appErrors('Password has been recently changed, please login again', 401));
  }
  req.user = currentUser;
  console.log(currentUser);
  next();
});

// following method if for rendered pages i.e. checking if the user is loggedin or not
exports.loggedInCheck = tryCatch(async(req, res,next) =>{
  if(req.cookies.jwt){   
  //Verify the Token
  const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
  console.log("Decoded.id   ",decoded.id);
  //check if user still exists
  const  currentUser = await User.findById(decoded.id);
  console.log("Inside secure    ",currentUser)
  if(!currentUser){
    return  next();
  };
  //check is user changed the password after sending the token
  if(currentUser.lastChangedPassword(decoded.iat)){
  return next();
  }
  //There is a loggedin User.
  //Each template will have access to res.locals hence therefore will have access to res.locals.user
  res.locals.user = currentUser;
  console.log("This is from loggedInCheck",res.locals.user);
  return next();
};
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
  const user = await User.findOne({email: req.body.email});
  if(!user){
    return next(new appErrors('This email is not registered for any user', 404));
  }
  // get created the ramdon reset token
  const resetToken = user.passwordResetToken();
  await user.save({validateBeforeSave: false});
  // send the link with the reset token to user's email
  const resetpasswordURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

  const message = `reset the password using this link ${resetpasswordURL}, after 15 minutes this link will be close`
  console.log("#####exports.lostPassword##### ",resetpasswordURL);
  try{
  await sendMail({
    email: user.email,
    subject: 'Your password reset link expiring in 15 minutes',
     message
  });
  res.status(200).json({
    status: 'success',
    message: 'Token is sent to email'
  });
} catch(err){
  user.resetToken =  undefined;
  user.passwordResetExpires = undefined;
  await user.save({validateBeforeSave: false});
  console.log("ERROR from CATCH   ",err);
  return next(new appErrors('A error was encountered while sending email', 500));
}
});
exports.resetPassword = tryCatch(async(req,res,next) => {  
  // user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  // if token has expired or not
  const user = await User.findOne({resetToken: hashedToken,
                passwordResetExpires: {$gt: Date.now()}
                 });
  if(!user){
    return next(new appErrors('Something is wrong with the Token', 400));  
  }
  console.log("###PASSWORD  ",req.body.password, "  confirm ",req.body);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update passwordChanged property for the user &
  //login User send JWT
  sendToken(newUser,201,res);
  });

exports.updatePassword = tryCatch(async (req, res, next) => {
console.log("inside ###################### updatePassword");
  console.log(req.user.id);
  // find user from collection
  const user = await User.findById(req.user.id).select('+password');
  // check if the password typed is correct
  if(!(await user.checkPassword(req.body.currentPassword, user.password))){
    return next(new appErrors('Current password is not correct',401));
  }
  // update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // can not use the findByIDAndUpdate because password and confirm password validation wud not work
  await user.save();
  // send JWT for signing in user
  sendToken(newUser,201,res);


});
