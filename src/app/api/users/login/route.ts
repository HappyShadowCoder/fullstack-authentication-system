import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest , NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json()
        const {email , password} = reqBody;
        console.log(reqBody);

        // Check if User Exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error : "User does not exist"} , {status : 400})
        }

        // Check if Password is Correct
        const validPassword = await bcryptjs.compare(password , user.password)
        if(!validPassword){
            return NextResponse.json({error : "Invaild password"} , {status : 500})
        }

        // Create Token Data
        const tokenData = {
            id : user._id,
            username : user.username,
            email : email.username
        }

        // Create Token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })
        const response = NextResponse.json({message : "Login Successful", success : true})
        response.cookies.set("token" , token , { // Save in Users in local storage
            httpOnly: true
        })

        return response;
    } catch (error : any) {
        return NextResponse.json({error : error.message} , {status : 500})
    }
}