
const nodemailer = require('nodemailer');
const { successResponse, errorResponse } = require('./app.response');

const sendEmail = async (res, user, url, subjects, message, title) => {
  // Create transporter for Brevo SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // LOG TO CONSOLE FOR DEVELOPMENT
  if (process.env.APP_NODE_ENV === 'development') {
    console.log('--- DEVELOPMENT EMAIL LOG ---');
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${subjects}`);
    console.log(`Link: ${url}`);
    console.log('-----------------------------');
  }

  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Beach Resort'}" <${process.env.SEND_SENDER_MAIL}>`,
      to: user.email,
      subject: subjects,
      text: message,
      html: `<div>
        <h4>${title}</h4>
        <p>${message}</p>
        <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"> >>> Click Here</a>
      </div>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      `Email sent to ${user.email} successful`
    ));
  } catch (error) {
    // eslint-disable-next-line no-param-reassign
    user.resetPasswordToken = undefined;
    // eslint-disable-next-line no-param-reassign
    user.resetPasswordExpire = undefined;

    // If user is a Mongoose model, it will have a .save() method
    if (typeof user.save === 'function') {
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};

module.exports = sendEmail;
