import { config } from "dotenv";
config({ path: ".env.local" });

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/config/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest'; // Fallback to 'latest' if not specified

    if (type === 'trending') {
      // Pull items that have the highest number of favorite selections or alerts tracked against them
      const trendingProducts = await prisma.product.findMany({
        take: 6,
        include: { retailers: { orderBy: { price: 'asc' } } },
        orderBy: {
          favorites: { _count: 'desc' }
        }
      });
      return NextResponse.json({ products: trendingProducts }, { status: 200 });
    }

    // Default: Pull Latest Products freshly ingested via your system workers
    const latestProducts = await prisma.product.findMany({
      take: 6,
      include: { retailers: { orderBy: { price: 'asc' } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products: latestProducts }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch product feed summaries', error: error.message }, { status: 500 });
  }
}