import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
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
    } catch (err: any) {
      console.error("❌ Failed to send verification email:", err.message);
      // You can choose to still return success or fail here
    }

    return NextResponse.json({
      message:
        "User registered successfully! Please check your email to verify your account.",
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle Mongo duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          error: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already in use`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          typeof error.message === "string"
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
