const Student = require('./../models/studentModel');
const tryCatch = require('./../lib/tryCatch');
const jwt = require('jsonwebtoken');

exports.signup = tryCatch( async (req,res,next) =>{
  const newUser = await Student.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE_IN
  });

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser
    }
  });
});
