import { NextResponse } from "next/server";
import User from "@/models/user";
import { dbConnect } from "@/utils/dbconnect";

export async function POST(req: Request) {
  await dbConnect();

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const { name, email, password } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
