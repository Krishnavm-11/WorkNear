import nodemailer from "nodemailer";

const sendOtpEmail = async (email, otp, purpose = "login") => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Gmail SMTP credentials are missing.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const isRegister = purpose === "register";

  try {
    const result = await transporter.sendMail({
      from: `"WorkNear" <${process.env.SMTP_USER}>`,
      to: email,
      subject: isRegister
        ? "WorkNear Registration OTP"
        : "WorkNear Login OTP",

      text: `Your WorkNear verification code is ${otp}.

This code expires in 5 minutes.

Do not share this code with anyone.`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #f97316;">WorkNear</h2>

          <h3>
            ${isRegister ? "Verify your email" : "Login verification code"}
          </h3>

          <p>Use this code to continue:</p>

          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 0;">
            ${otp}
          </div>

          <p>This code expires in 5 minutes.</p>

          <p style="color: #6b7280; font-size: 13px;">
            Never share your verification code with anyone.
          </p>
        </div>
      `,
    });

    console.log("WorkNear OTP email sent:", result.messageId);

    return result;
  } catch (error) {
    console.error("Nodemailer error:", error.message);

    throw new Error("Unable to send verification email.");
  }
};

export default sendOtpEmail;