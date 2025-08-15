import {connect} from '@/dbConfig/dbConfig'
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

connect()

export  async function POST(request : NextRequest){
    try {
        const reqBody = await request.json()
        const {token , password , confirmPassword} = reqBody;

        if (password !== confirmPassword) {
          return NextResponse.json(
            { error: "New password and confirm password do not match." },
            { status: 400 }
          );
        }
        const user = await User.findOne({
          forgotPasswordToken: token,
          forgotPasswordTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
          return NextResponse.json(
            { error: "Invalid or expired token." },
            { status: 400 }
          );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined; 
        user.forgotPasswordTokenExpiry = undefined; 
        await user.save();

        return NextResponse.json({
          message: "Password reset successfully!",
          success: true,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}