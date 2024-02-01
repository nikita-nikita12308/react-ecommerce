import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Usually 587 for secure or 25 for unencrypted
    secure: false, // Use true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

const mailOptions = {
    from: {
      name: "Сирна Насолода",
      address: process.env.GMAIL_USER
    },
    to: 'ndatskiy@gmail.com',
    subject: 'Відновлення паролю',
    text: 'This is the text body of the email',
    html: `<p>Your Reset password token click the link to reset password."</p>`,
  };
try{
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    console.log("mail sended")
}catch(err){
    console.error(err.message)
}
