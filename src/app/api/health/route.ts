import { NextResponse } from 'next/server';
import prisma from '@/config/db';

export async function GET() {
  try {
    // Run a fast raw query to confirm Postgres communication
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { status: 'OK', message: 'Full-stack Next.js Backend & Vercel Postgres connected successfully via Prisma!' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'Error', message: 'Vercel Postgres connection failed', details: error.message },
      { status: 500 }
    );
  }
}