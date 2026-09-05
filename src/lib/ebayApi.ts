// lib/ebayApi.ts

export interface ScrapedProduct {
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

/**
 * Obtains an application access token using eBay App Credentials
 */
async function getEbayAccessToken(): Promise<string | null> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn('[eBay API] Missing EBAY_CLIENT_ID or EBAY_CLIENT_SECRET in env variables.');
    return null;
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error('[eBay API Token Error]:', err);
    return null;
  }
}

/**
 * Queries eBay Browse API for exact product deals sorted by price
 */
export async function searchEbayApi(searchQuery: string): Promise<ScrapedProduct[]> {
  const token = await getEbayAccessToken();
  if (!token) return [];

  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(searchQuery)}&sort=price&limit=5`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = data.itemSummaries || [];

    if (items.length === 0) return [];

    return items.map((item: any) => {
      const price = parseFloat(item.price?.value || '0');
      const shipping = parseFloat(item.shippingOptions?.[0]?.shippingCost?.value || '0');

      return {
        title: item.title,
        price,
        imageUrl: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || '',
        rating: 4.8,
        isAvailable: true,
        deliveryCharges: shipping,
        sellerName: item.seller?.username || 'eBay Verified Seller',
        productUrl: item.itemWebUrl, // Direct item URL (e.g. https://www.ebay.com/itm/123456789)
        retailerName: 'EBAY',
      };
    });
  } catch (err) {
    console.error('[eBay API Search Error]:', err);
    return [];
  }
}