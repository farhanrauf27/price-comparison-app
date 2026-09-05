import { NextResponse } from 'next/server';
import { scrapeAllStores } from '@/services/scraper';

// Increase maximum route execution duration (Next.js App Router)
export const maxDuration = 60; // Max allowed seconds for execution
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Scrape stores concurrently
    const products = await scrapeAllStores(query);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('[API Error]:', error);
    return NextResponse.json({ error: 'Failed to scrape stores' }, { status: 500 });
  }
}