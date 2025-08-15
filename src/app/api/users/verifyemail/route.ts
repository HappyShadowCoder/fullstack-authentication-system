import {connect} from "@/dbConfig/dbConfig";
import { verify } from "crypto";
import { NextRequest, NextResponse  } from "next/server";
import User from "@/models/userModel"

connect()

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne({
          verifyToken: token,
          verifyTokenExpiry: { $gt: Date.now() }, // Make sure this matches your schema
        });

        if(!user){
            return new Response("Invalid token", {status : 401});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = null;
        user.verifyTokenExpiry = null;
        await user.save();

        return NextResponse.json({
            message : "Email verified successfully",
            success : true
        })
    } catch (error : any) {
        return NextResponse.json({error : error.message} , {status : 500})
    }
}