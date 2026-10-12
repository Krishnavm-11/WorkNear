
import nodemailer from "nodemailer";

const sendOtpEmail = async (email, otp, purpose = "login") => {
  const { SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Email service is not configured. Check SMTP_USER and SMTP_PASS."
    );
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const isRegister = purpose === "register";
  const purposeText = isRegister ? "registration" : "login";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  try {
    await transporter.verify();
    console.log("WorkNear SMTP connection verified.");

    const result = await transporter.sendMail({
      from: `"WorkNear" <${SMTP_USER}>`,
      to: email,
      subject: `WorkNear ${isRegister ? "Registration" : "Login"} OTP`,
      text: `Your WorkNear ${purposeText} OTP is ${otp}. It expires in 5 minutes. Do not share this code.`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f3ef;padding:30px;">
          <div style="max-width:440px;margin:auto;background:#fff;padding:30px;border-radius:14px;">
            <h1 style="color:#f97316;">WorkNear</h1>
            <h2>${isRegister ? "Verify your email" : "Verify your login"}</h2>
            <p>Use this code to complete your ${purposeText}.</p>
            <div style="padding:20px;background:#fff7ed;text-align:center;border-radius:10px;">
              <h1 style="letter-spacing:8px;color:#c2410c;">${otp}</h1>
            </div>
            <p>This code expires in 5 minutes.</p>
            <p>Never share your verification code with anyone.</p>
          </div>
        </div>
      `,
    });

    console.log("WorkNear OTP accepted by mail server:", {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
    });

    if (result.rejected?.length) {
      throw new Error("The email server rejected the recipient address.");
    }

    return result;
  } catch (error) {
    console.error("WorkNear SMTP error:", {
      code: error.code,
      command: error.command,
      message: error.message,
    });

    throw error;
  } finally {
    transporter.close();
  }
};

export default sendOtpEmail;
