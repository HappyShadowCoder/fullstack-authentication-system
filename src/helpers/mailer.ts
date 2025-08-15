import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

const apiKey = process.env.MAILERSEND_API_KEY;
if (!apiKey) {
  throw new Error(
    "MAILERSEND_API_KEY is not defined in the environment variables."
  );
}

// Initialize MailerSend with API key
const mailerSend = new MailerSend({ apiKey });

// Utility to get correct base URL
const getBaseUrl = () => {
  if (process.env.DOMAIN) return process.env.DOMAIN; // Prefer explicit env var
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel auto var
  return "http://localhost:3000"; // Fallback for local dev
};

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const baseUrl = getBaseUrl();
    const verifyLink = `${baseUrl}/verifytoken?token=${hashedToken}`;
    const resetLink = `${baseUrl}/resetpassword?token=${hashedToken}`;

    const fromEmail =
      process.env.MAILERSEND_FROM_EMAIL || "noreply@yourdomain.com";
    const sentFrom = new Sender(fromEmail, "Your App Name");
    const recipients = [new Recipient(email)];

    let subject = "";
    let htmlContent = "";

    if (emailType === "VERIFY") {
      subject = "Verify your account";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #1a202c; color: #e2e8f0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #2d3748; padding: 30px; border-radius: 10px;">
            <h1 style="font-size: 24px; font-weight: bold; text-align: center; color: #4299e1;">Verify Your Account</h1>
            <p style="text-align: center; color: #a0aec0;">Click the button below or use the link to verify your email address.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${verifyLink}" style="padding: 12px 24px; background-color: #4299e1; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account</a>
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #a0aec0;">If the button doesn't work, copy and paste this link:</p>
            <div style="text-align: center; margin-top: 10px; padding: 10px; background-color: #1a202c; border: 1px solid #4a5568; border-radius: 5px; overflow-wrap: break-word;">
              <code>${verifyLink}</code>
            </div>
          </div>
        </div>
      `;
    } else if (emailType === "RESET") {
      subject = "Reset your password";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #1a202c; color: #e2e8f0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #2d3748; padding: 30px; border-radius: 10px;">
            <h1 style="font-size: 24px; font-weight: bold; text-align: center; color: #4299e1;">Password Reset Request</h1>
            <p style="text-align: center; color: #a0aec0;">Click the button below to change your password.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${resetLink}" style="padding: 12px 24px; background-color: #4299e1; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #a0aec0;">If the button doesn't work, copy and paste this link:</p>
            <div style="text-align: center; margin-top: 10px; padding: 10px; background-color: #1a202c; border: 1px solid #4a5568; border-radius: 5px; overflow-wrap: break-word;">
              <code>${resetLink}</code>
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #a0aec0;">If you did not request this, you can ignore this email.</p>
          </div>
        </div>
      `;
    }

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(htmlContent)
      .setText(htmlContent);

    return await mailerSend.email.send(emailParams);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
