import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Usually 587 for secure or 25 for unencrypted
  secure: false, // Use true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailStyle = (mainText) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h3 {
            color: #3498db;
          }
          span.status {
            color: #e74c3c;
            font-weight: bold;
          }
          p {
            margin: 15px 0;
            color: #555;
          }
          a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${mainText}
        </div>
        <div class="footer">
          <p>Це автоматичне повідомлення. Будь ласка, не відповідайте на нього.</p>
        </div>
      </body>
    </html>
    `;
};

export { transporter, mailStyle };
