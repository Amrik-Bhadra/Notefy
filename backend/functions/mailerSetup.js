const nodemailer = require('nodemailer');
require('dotenv').config();

const senderEmail = process.env.SENDER;
const senderPass = process.env.EMAIL_PASS;

const sendOTP = async (email, otp) => {
    console.log('i am here inside send otp');
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: senderPass
            }
        });

        const mailOptions = {
            from: senderEmail,
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending OTP email:", err);
                return reject('Error sending OTP');
            }
            console.log("OTP sent:", info.response);
            resolve();
        });
    });
};

module.exports = { sendOTP };
