
import { Resend } from "resend";

const sendOtpEmail = async (email, otp, purpose = "login") => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const isRegister = purpose === "register";
  const purposeText = isRegister ? "registration" : "login";

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [email],
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

    if (error) {
      console.error("Resend email error:", error.message);
      throw new Error("Unable to send verification email.");
    }

    console.log("WorkNear OTP email accepted:", data?.id);

    return data;
  } catch (error) {
    console.error("WorkNear email error:", error.message);
    throw error;
  }
};

export default sendOtpEmail;
