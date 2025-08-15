import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    console.log("Received email for password reset:", email);

    // Find the user by their email
    const user = await User.findOne({ email });

    // If no user is found, return a JSON error response
    if (!user) {
      // This message is intentionally vague for security reasons
      return NextResponse.json(
        {
          error:
            "If a user with that email exists, a password reset link has been sent.",
        },
        { status: 400 }
      );
    }
    console.log("Found user:", user);

    // Correctly pass the user's ID as 'userId'
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({
      message: "Password reset link has been sent to your email",
      success: true,
    });
  } catch (error: any) {
    const errorMessage =
      (typeof error?.message === "string"
        ? error.message
        : JSON.stringify(error)) || "Unknown server error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
