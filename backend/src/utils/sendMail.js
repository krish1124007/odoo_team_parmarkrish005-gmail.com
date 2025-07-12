import nodemailer from "nodemailer"

async function sendMail(subject, html, email) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to:", email);
    return true;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return false;
  }
}

export { sendMail }
