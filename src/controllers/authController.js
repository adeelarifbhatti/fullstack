const Student = require('./../models/studentModel');
const tryCatch = require('./../lib/tryCatch');

exports.signup = tryCatch( async (req,res,next) =>{
  const newUser = await Student.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
