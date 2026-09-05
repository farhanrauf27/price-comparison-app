export interface RetailerDeal {
  title: string;
  price: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
  deliveryCharges: number;
  sellerName: string;
  productUrl: string;
  retailerName: string;
}

export interface PriceComparisonSummary {
  cheapestDeal: RetailerDeal | null;
  highestPrice: number;
  potentialSavings: number;
  totalRetailersCompared: number;
  deals: RetailerDeal[];
}

export function calculatePriceComparison(deals: RetailerDeal[]): PriceComparisonSummary | null {
  if (!deals || deals.length === 0) return null;

  // Ensure items are sorted low to high
  const sortedDeals = [...deals].sort((a, b) => {
    const totalA = a.price + (a.deliveryCharges || 0);
    const totalB = b.price + (b.deliveryCharges || 0);
    return totalA - totalB;
  });

  const cheapestDeal = sortedDeals[0] || null;
  const highestDeal = sortedDeals[sortedDeals.length - 1] || null;

  const cheapestTotal = cheapestDeal ? cheapestDeal.price + (cheapestDeal.deliveryCharges || 0) : 0;
  const highestTotal = highestDeal ? highestDeal.price + (highestDeal.deliveryCharges || 0) : 0;
  const potentialSavings = Math.max(0, Math.round((highestTotal - cheapestTotal) * 100) / 100);

  return {
    cheapestDeal,
    highestPrice: highestTotal,
    potentialSavings,
    totalRetailersCompared: sortedDeals.length,
    deals: sortedDeals,
  };
}