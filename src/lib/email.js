const nodemailer = require('nodemailer');

const sendEmail = options =>{
	// Create a transporter

	const  transporter = nodemailer.createTransport({
		host: process.env.EMAIL-SERVER,
		port: process.env.EMAIL-PORT,
		auth:{
			user: process.env.EMAIL-USERNAME,
			pass: process.env.EMAIL-PASSWORD
		}
	});
	//define the email options
	const mailOptions = {
		from: 'Adeel Arif Bhatti <adeelarifbhatti@gmail.com>',
		from: options.email,
		subject: options.subject,
		text: options.message
	};
	//Actually send the email
	transporter.sendEmail(mailOptions);

}