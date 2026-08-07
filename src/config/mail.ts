import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (
  email: string,
  otp: string
) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset OTP is ${otp}. It will expire in 5 minutes.`,
  });
};
