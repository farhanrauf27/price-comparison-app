import { config } from "dotenv";
config({ path: ".env.local" });

import { NextResponse } from 'next/server';
import prisma from '@/config/db';

export async function GET() {
  try {
    // Aggregates both operational classification parameters safely
    const [categories, retailersSummary] = await Promise.all([
      prisma.category.findMany({
        include: { _count: { select: { products: true } } }
      }),
      // Pull unique retailer storefront labels currently saved in the index
      prisma.retailer.groupBy({
        by: ['name'],
        _count: { name: true }
      })
    ]);

    return NextResponse.json({
      categories,
      retailers: retailersSummary.map((r: { name: string }) => r.name)
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Category collection retrieval broken', error: error.message }, { status: 500 });
  }
}