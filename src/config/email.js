import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Sesuaikan dengan provider email Anda
  auth: {
    user: process.env.EMAIL, // Email Anda
    pass: process.env.EMAIL_PASSWORD, // Password email Anda (atau App Password jika menggunakan Gmail)
  },
});

export default transporter;
