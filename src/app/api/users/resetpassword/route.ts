import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email address" },
        { status: 404 }
      );
    }

    // Send reset email
    try {
      await sendEmail({ email, emailType: "RESET", userId: user._id });
    } catch (err: any) {
      console.error("❌ Failed to send reset email:", err.message);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
