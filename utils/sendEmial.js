import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"Task Management App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to the Website 🎉",
      html: `<h2>Welcome, ${name}!</h2><p>We're excited to have you on board.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to: ${email}`, info.response);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
  }
};
