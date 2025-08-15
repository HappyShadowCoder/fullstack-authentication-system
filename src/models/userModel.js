import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";
// import { type } from "os";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true , "Please provide a Username"],
        unique : true 
    },
    email : {
        type : String,
        required : [true , "Please provide an Email"],
        unique : true
    },
    password : {
        type : String,
        required : [true , "Please provide a Password"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date
})

const User = mongoose.models.users || mongoose.model("users" , userSchema);

export default User;