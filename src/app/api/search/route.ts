import { NextResponse } from 'next/server';
import { scrapeAllStores } from '@/services/scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  // Scrapes Amazon, eBay, Walmart, and Target simultaneously
  const deals = await scrapeAllStores(query);

  if (deals.length === 0) {
    return NextResponse.json({ message: `No valid deals found for "${query}"` }, { status: 404 });
  }

  return NextResponse.json({ deals });
}