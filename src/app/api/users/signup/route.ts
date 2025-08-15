import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, username } = reqBody;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Send verification email
    try {
      await sendEmail({
        email: savedUser.email,
        emailType: "VERIFY",
        userId: savedUser._id,
      });
    } catch (mailError) {
      console.error("❌ Failed to send verification email:", mailError);
      return NextResponse.json(
        { error: "Account created but failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        "Signup successful! Please check your email for verification link.",
      success: true,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
