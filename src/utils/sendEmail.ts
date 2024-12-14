/* eslint-disable no-console */
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'ikraamoni@gmail.com',
      pass: 'vnmk pitr cvak rjxw',
    },
  });

  try {
    await transporter.sendMail({
      from: 'ikraamoni@gmail.com',
      to, 
      subject: 'Password Reset Request', 
      html: `
        <p>Click the link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `, 
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
