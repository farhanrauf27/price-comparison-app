import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/config/db';
import { calculatePriceComparison } from '@/lib/comparisonEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        retailers: true,
      }
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const deals = product.retailers.map(r => ({
      title: product.title,
      imageUrl: product.image ?? '',
      rating: 0,
      retailerName: r.name,
      price: r.price,
      deliveryCharges: 0,
      isAvailable: r.inStock,
      productUrl: r.productUrl,
      sellerName: r.name
    }));

    const summary = calculatePriceComparison(deals);

    return NextResponse.json({
      productTitle: product.title,
      productImage: product.image,
      summary
    }, { status: 200 });

  } catch (error: any) {
    console.error('Comparison calculation error:', error);
    return NextResponse.json({ message: 'Failed to process price comparison', error: error.message }, { status: 500 });
  }
}