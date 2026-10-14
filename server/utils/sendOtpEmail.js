
const sendOtpEmail = async (email, otp, purpose = "login") => {
  const apiUrl = process.env.MAIL_API_URL;
  const apiSecret = process.env.MAIL_API_SECRET;

  if (!apiUrl || !apiSecret) {
    throw new Error(
      "Google email service settings are missing."
    );
  }

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof otp !== "string" ||
    !/^\d{6}$/.test(otp)
  ) {
    throw new Error("Invalid email address or OTP.");
  }

  if (!["register", "login"].includes(purpose)) {
    throw new Error("Invalid OTP email purpose.");
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: apiSecret,
        email: email.trim().toLowerCase(),
        otp,
        purpose,
      }),
      signal: AbortSignal.timeout(20000),
    });

    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error(
        "Google email API returned a non-JSON response:",
        responseText.slice(0, 300)
      );

      throw new Error(
        "Email service returned an unexpected response."
      );
    }

    if (!response.ok || result.success !== true) {
      throw new Error(
        result.message ||
          `Email service returned status ${response.status}`
      );
    }

    console.log(
      `WorkNear ${purpose} OTP email request succeeded.`
    );

    return result;
  } catch (error) {
    console.error(
      "Google email API error:",
      error.message
    );

    throw new Error("Unable to send verification email.");
  }
};

export default sendOtpEmail;
