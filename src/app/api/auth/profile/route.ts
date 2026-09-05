import { config } from "dotenv";
config({ path: ".env.local" });

import { NextResponse } from 'next/server';
import prisma from '@/config/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  try {
    // 1. Extract the token from cookies to verify who is making the request
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized session' }, { status: 401 });
    }

    // 2. Decode the user ID out of the token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // 3. Parse input body parameters
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Name cannot be empty' }, { status: 400 });
    }

    // 4. Run the update command against PostgreSQL
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name },
      select: { id: true, name: true, email: true } // Don't return the hashed password string
    });

    return NextResponse.json({
      message: 'Profile details updated successfully',
      user: updatedUser
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update profile data', error: error.message }, { status: 500 });
  }
}