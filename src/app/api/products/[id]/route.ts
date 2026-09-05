import { config } from "dotenv";
config({ path: ".env.local" });

import { NextResponse } from 'next/server';
import prisma from '@/config/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        retailers: {
          orderBy: { price: 'asc' }
        },
        priceHistory: {
          orderBy: { createdAt: 'asc' } // Ascending layout matches Chart.js trend timeline sorting
        },
        category: true
      }
    });

    if (!product) {
      return NextResponse.json({ message: 'Product profile record not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to pull item profile', error: error.message }, { status: 500 });
  }
}
