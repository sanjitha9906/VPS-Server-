import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const body = await req.json();

    const email =
      body.email.trim().toLowerCase();

    const password =
      body.password.trim();

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return NextResponse.json({
        success: false,
        message: "User not found",
      });

    }

    console.log("ENTERED:", password);

    console.log("DATABASE:", user.password);

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log("MATCH:", isMatch);

    if (!isMatch) {

      return NextResponse.json({
        success: false,
        message: "Invalid password",
      });

    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });

  }

}