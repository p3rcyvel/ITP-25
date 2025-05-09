const EMAIL_USER = "shashikaumesh8864@gmail.com";
const EMAIL_PASSWORD = "plrr meln rywt ripl";
const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: EMAIL_USER, // Sender address
      to: "hiranshalon780@gmail.com", // Recipient address
      subject: options.subject, // Email subject
      text: options.text, // Plain text body
      html: options.html, // HTML body
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };
