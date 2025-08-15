import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Connect to the database
connect();

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the token in the request
    const userID = await getDataFromToken(request);

    // Corrected: Use the proper Mongoose syntax for findById
    // which takes the ID directly as an argument.
    const user = await User.findById(userID).select("-password");

    // Check if the user was found
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json({
      message: "User fetched",
      data: user,
    });
  } catch (error: any) {
    // Handle any errors that occur during the process
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
