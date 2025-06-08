// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from "@/models/user";
import { dbConnect } from "@/utils/dbconnect";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Optionally fetch user from database to ensure user still exists
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          valid: true, 
          user: {
            id: user._id,
            email: user.email,
            name: user.name
          }
        },
        { status: 200 }
      );
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}