import * as cheerio from 'cheerio';

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

/* ==========================================================================
   STRICT TITLE MATCHING
   ========================================================================== */

const UNIVERSAL_ACCESSORY_KEYWORDS = [
  'case', 'cover', 'screen protector', 'tempered glass', 'film',
  'cable', 'charger', 'adapter', 'box only', 'empty box', 'for parts',
  'parts only', 'repair', 'dummy', 'strap', 'band', 'skin',
  'pouch', 'sleeve', 'holder', 'stand', 'shell', 'sticker', 'replacement',
  'cushion', 'pad', 'battery only', 'mount', 'remote only', 'bag', 'cap',
  'keychain', 'decal', 'thermal paste'
];

function isTitleMatching(title: string, searchQuery: string): boolean {
  const titleLower = title.toLowerCase();
  const queryLower = searchQuery.toLowerCase().trim();

  const isAccessory = UNIVERSAL_ACCESSORY_KEYWORDS.some(keyword => titleLower.includes(keyword));
  if (isAccessory) return false;

  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  if (queryWords.length === 0) return true;

  const matchedCount = queryWords.reduce((acc, word) => {
    return titleLower.includes(word) ? acc + 1 : acc;
  }, 0);

  return (matchedCount / queryWords.length) >= 0.4;
}

/* ==========================================================================
   MAIN SCRAPER ENGINE
   ========================================================================== */

export async function scrapeAllStores(searchQuery: string): Promise<ScrapedProduct[]> {
  const stores = ['amazon', 'ebay', 'walmart', 'aliexpress'];
  
  const storePromises = stores.map(store => scrapeSingleStore(store, searchQuery));
  const results = await Promise.allSettled(storePromises);

  const bestDeals: ScrapedProduct[] = [];

  results.forEach((res) => {
    if (res.status === 'fulfilled' && res.value && res.value.length > 0) {
      const cheapest = res.value.sort((a, b) => a.price - b.price)[0];
      if (cheapest) {
        bestDeals.push(cheapest);
      }
    }
  });

  return bestDeals.sort((a, b) => a.price - b.price);
}

export async function scrapeSingleStore(retailer: string, searchQuery: string): Promise<ScrapedProduct[] | null> {
  const store = retailer.toLowerCase().trim();
  const cleanQuery = searchQuery.trim();

  switch (store) {
    case 'ebay':
      return await scrapeEbaySmart(cleanQuery);
    case 'walmart':
      return await fetchWalmartSerpAPI(cleanQuery);
    case 'amazon':
      return await scrapeAmazon(cleanQuery);
    case 'aliexpress':
      return await scrapeAliExpress(cleanQuery);
    default:
      return null;
  }
}

/* ==========================================================================
   1. EBAY: Browse API (if Token exists) -> Native XML Feed (Pending Approval)
   ========================================================================== */

async function scrapeEbaySmart(searchQuery: string): Promise<ScrapedProduct[] | null> {
  const oauthToken = process.env.EBAY_OAUTH_TOKEN;

  // Try official eBay API if token is present
  if (oauthToken && oauthToken.trim().length > 0) {
    try {
      const endpoint = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(searchQuery)}&limit=10`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY-US'
        },
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const items = data?.itemSummaries || [];
        const products: ScrapedProduct[] = [];

        for (const item of items) {
          const title = item.title;
          const price = parseFloat(item.price?.value || '0');
          if (!title || isNaN(price) || price <= 0 || !isTitleMatching(title, searchQuery)) continue;

          let productUrl = item.itemWebUrl;
          if (item.itemId) {
            const rawId = item.itemId.includes('|') ? item.itemId.split('|')[1] : item.itemId;
            productUrl = `https://www.ebay.com/itm/${rawId}`;
          }

          products.push({
            title,
            price,
            imageUrl: item.image?.imageUrl || '',
            rating: 4.7,
            isAvailable: true,
            deliveryCharges: 0,
            sellerName: item.seller?.username || 'eBay Seller',
            productUrl,
            retailerName: 'EBAY'
          });
        }
        if (products.length > 0) return products;
      }
    } catch (err) {
      // Fall through to pending-approval XML engine
    }
  }

  // PENDING APPROVAL ENGINE: Direct XML Feed (Extracts live /itm/ links instantly)
  return await fetchEbayXMLNative(searchQuery);
}

async function fetchEbayXMLNative(searchQuery: string): Promise<ScrapedProduct[] | null> {
  const xmlUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}&_rss=1`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(xmlUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const xmlText = await response.text();
    const $ = cheerio.load(xmlText, { xmlMode: true });
    const products: ScrapedProduct[] = [];

    $('item').each((_, element) => {
      const el = $(element);
      const title = el.find('title').text().trim();
      const rawLink = el.find('link').text().trim();
      const description = el.find('description').text();

      if (!title || !rawLink || !isTitleMatching(title, searchQuery)) return;

      const priceMatch = (title + ' ' + description).match(/[\$\£\€]\s*(\d+(?:\.\d+)?)/);
      if (!priceMatch) return;

      const price = parseFloat(priceMatch[1]);
      if (isNaN(price) || price <= 0) return;

      // Extract specific item ID to construct dynamic detail URL: https://www.ebay.com/itm/188876706571
      let productUrl = rawLink;
      const itemIdMatch = rawLink.match(/\/itm\/(?:[^\/]+\/)?(\d+)/) || rawLink.match(/itm\/(\d+)/);
      if (itemIdMatch && itemIdMatch[1]) {
        productUrl = `https://www.ebay.com/itm/${itemIdMatch[1]}`;
      }

      let imageUrl = '';
      const imgMatch = description.match(/src=["'](https?:\/\/[^"']+)["']/i);
      if (imgMatch) imageUrl = imgMatch[1];

      products.push({
        title,
        price,
        imageUrl,
        rating: 4.7,
        isAvailable: true,
        deliveryCharges: 0,
        sellerName: 'eBay Seller',
        productUrl,
        retailerName: 'EBAY'
      });
    });

    return products.length > 0 ? products : null;
  } catch (err) {
    return null;
  }
}

/* ==========================================================================
   2. WALMART: SerpAPI Endpoint (Direct JSON -> /ip/ Links)
   ========================================================================== */

async function fetchWalmartSerpAPI(searchQuery: string): Promise<ScrapedProduct[] | null> {
  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    console.warn('[Walmart API Warning] Missing SERPAPI_KEY in .env.local');
    return null;
  }

  const endpoint = `https://serpapi.com/search.json?engine=walmart&query=${encodeURIComponent(searchQuery)}&api_key=${serpApiKey}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    const items = data?.organic_results || [];
    const products: ScrapedProduct[] = [];

    for (const item of items) {
      const title = item.title;
      const price = parseFloat(item.primary_offer?.offer_price || item.price || '0');
      const itemLink = item.link || '';

      if (!title || isNaN(price) || price <= 0 || !isTitleMatching(title, searchQuery)) {
        continue;
      }

      // Format canonical direct /ip/ product detail URL
      let productUrl = itemLink;
      if (item.us_item_id) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        productUrl = `https://www.walmart.com/ip/${slug}/${item.us_item_id}`;
      } else if (itemLink.includes('/ip/')) {
        productUrl = itemLink.split('?')[0];
      }

      products.push({
        title,
        price,
        imageUrl: item.thumbnail || '',
        rating: item.rating || 4.4,
        isAvailable: true,
        deliveryCharges: 0,
        sellerName: 'Walmart',
        productUrl,
        retailerName: 'WALMART'
      });
    }

    return products.length > 0 ? products : null;
  } catch (err) {
    console.error('[Walmart SerpAPI Error]:', err);
    return null;
  }
}

/* ==========================================================================
   3. AMAZON (ScraperAPI)
   ========================================================================== */

async function scrapeAmazon(searchQuery: string): Promise<ScrapedProduct[] | null> {
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  if (!scraperApiKey) return null;

  const targetUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`;
  const fetchUrl = `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}&country_code=us`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(fetchUrl, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    $('[data-component-type="s-search-result"]').each((_, element) => {
      const el = $(element);
      const asin = el.attr('data-asin');
      if (!asin) return;

      const title = el.find('h2 a span, h2 span, .a-size-medium').first().text().trim();
      if (!title || !isTitleMatching(title, searchQuery)) return;

      const whole = el.find('.a-price-whole').first().text().replace(/[,.]/g, '').trim();
      const fraction = el.find('.a-price-fraction').first().text().trim() || '00';
      let price = parseFloat(`${whole}.${fraction}`);

      if (isNaN(price) || price <= 0) {
        const offscreen = el.find('.a-price .a-offscreen').first().text().trim();
        const match = offscreen.match(/[\$\£\€]\s*(\d+(?:\.\d+)?)/);
        if (match) price = parseFloat(match[1]);
      }

      if (isNaN(price) || price <= 0) return;

      products.push({
        title,
        price,
        imageUrl: el.find('img.s-image').attr('src') || '',
        rating: 4.5,
        isAvailable: true,
        deliveryCharges: 0,
        sellerName: 'Amazon Merchant',
        productUrl: `https://www.amazon.com/dp/${asin}`,
        retailerName: 'AMAZON'
      });
    });

    return products.length > 0 ? products : null;
  } catch (e) {
    return null;
  }
}

/* ==========================================================================
   4. ALIEXPRESS (ScraperAPI)
   ========================================================================== */

async function scrapeAliExpress(searchQuery: string): Promise<ScrapedProduct[] | null> {
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  if (!scraperApiKey) return null;

  const targetUrl = `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(searchQuery)}.html`;
  const fetchUrl = `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}&country_code=us`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(fetchUrl, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    $('a[href*="/item/"]').each((_, element) => {
      const el = $(element);
      const title = el.find('h1, h3, [class*="title"]').first().text().trim() || el.attr('title') || '';
      const rawHref = el.attr('href');

      if (!title || !rawHref || !rawHref.includes('/item/')) return;
      if (!isTitleMatching(title, searchQuery)) return;

      const fullText = el.parents().eq(1).text();
      const match = fullText.match(/[\$\£\€]\s*(\d+(?:\.\d+)?)/);
      if (!match) return;

      const price = parseFloat(match[1]);
      if (isNaN(price) || price <= 0) return;

      let productUrl = rawHref.split('?')[0];
      if (productUrl.startsWith('//')) {
        productUrl = `https:${productUrl}`;
      } else if (!productUrl.startsWith('http')) {
        productUrl = `https://www.aliexpress.com${productUrl}`;
      }

      products.push({
        title,
        price,
        imageUrl: el.find('img').first().attr('src') || '',
        rating: 4.6,
        isAvailable: true,
        deliveryCharges: 0,
        sellerName: 'AliExpress Seller',
        productUrl,
        retailerName: 'ALIEXPRESS'
      });
    });

    return products.length > 0 ? products : null;
  } catch (e) {
    return null;
  }
}