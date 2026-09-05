import { config } from "dotenv";
config({ path: ".env.local" });

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/config/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Build independent conditional query filtration filters
    const whereClause: any = {};

    if (query) {
      whereClause.title = { contains: query, mode: 'insensitive' };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // Fetch items with matching active price snapshots attached
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          retailers: {
            orderBy: { price: 'asc' } // Automatically displays lowest price deal first
          },
          category: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where: whereClause })
    ]);

    return NextResponse.json({
      products,
      meta: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to retrieve products', error: error.message }, { status: 500 });
  }
}