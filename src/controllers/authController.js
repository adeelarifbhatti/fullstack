const { promisify } = require('util');
const Student = require('./../models/studentModel');
const tryCatch = require('./../lib/tryCatch');
const appErrors = require('./../lib/appErrors');
const jwt = require('jsonwebtoken');


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
  req.user = currentStudent;
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