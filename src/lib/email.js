const nodemailer = require('nodemailer');

const sendMail = options =>{
	// Create a transporter

	const  transporter = nodemailer.createTransport({
		host: process.env.EMAIL_SERVER,
		port: process.env.EMAIL_PORT,
		auth:{
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});
	//define the email options
	const mailOptions = {
		from: 'Adeel Arif Bhatti <adeelarifbhatti@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message
	};
	//Actually send the email
	transporter.sendMail(mailOptions);

}
module.exports = sendMail;
