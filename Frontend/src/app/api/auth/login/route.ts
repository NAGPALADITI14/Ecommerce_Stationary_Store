import { NextResponse } from "next/server";
import User from "@/models/user";
import { dbConnect } from "@/utils/dbconnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
