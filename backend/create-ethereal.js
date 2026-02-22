const nodemailer = require('nodemailer');
nodemailer.createTestAccount().then(acc=>{
  console.log(acc);
});