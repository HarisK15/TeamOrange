const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cluckeradmn@gmail.com', 
    pass: 'kbxtfjkwucdafbyt', 
  },
  debug: true // Enable debugging
});

module.exports = transporter;