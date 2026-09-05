import { config } from "dotenv";
config({ path: ".env.local" });

import { NextResponse } from 'next/server';
import prisma from '@/config/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Security Best Practice: Don't explicitly reveal if an email doesn't exist
    if (!user) {
      return NextResponse.json({ message: 'If that email exists, a reset link has been dispatched.' }, { status: 200 });
    }

    // In production, you would generate a temporary reset token, save it to the DB,
    // and email it to the user. For now, we will log the action and return success.
    console.log(`Password reset link requested for user record: ${user.id}`);

    return NextResponse.json({ 
      message: 'If that email exists, a reset link has been dispatched.' 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to process request', error: error.message }, { status: 500 });
  }
}