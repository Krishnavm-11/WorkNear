
import { Resend } from "resend";

const sendOtpEmail = async (email, otp, purpose = "login") => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const isRegister = purpose === "register";

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "WorkNear <onboarding@resend.dev>",
    to: [email],
    subject: isRegister
      ? "WorkNear Registration OTP"
      : "WorkNear Login OTP",
    text: `Your WorkNear OTP is ${otp}. It expires in 5 minutes. Do not share this code.`,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Unable to send verification email.");
  }

  console.log("WorkNear OTP email accepted:", data?.id);
  return data;
};

export default sendOtpEmail;
