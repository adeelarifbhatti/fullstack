const Student = require('./../models/studentModel');
const tryCatch = require('./../lib/tryCatch');
const appErrors = require('./../lib/appErrors');
const jwt = require('jsonwebtoken');


const  signToken = id => {
  return jwt.sign({id:Student._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  })
}
exports.signup = tryCatch( async (req,res,next) =>{
  const newStudent = await Student.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
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
    return next(new appErrors('please enter the email and password',401))

  }


  // Send token to the client
  console.log(currentStudent);
  const token= signToken(currentStudent._id);
  res.status(200).json({
    status:'success',
    token
  });

});
