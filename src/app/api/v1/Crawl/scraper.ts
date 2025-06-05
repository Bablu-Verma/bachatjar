import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';




type Product = {
  title: string;
  price: string;
  source: string;
  image: string;
  create_date: Date;
  real_price?: string | null; 
  redirect_url:string
};

function getRandomUserAgent() {
  return new UserAgent().toString();
}

async function scrapeAmazon(): Promise<Product[]> {
  const details = {
    url: 'https://example1.com/products', // 👈 Replace with actual Amazon category/listing URL
    source: 'Amazon',
    main_container: '.product-card',      // 👈 Replace with actual selector
    title: '.product-title',              // 👈 Replace with actual selector
    price: '.price',                      // 👈 Replace with actual selector
    image: 'img',
    link:'_redirect_link',                         // 👈 Replace with actual selector
    real_price: '.real-price',            // Optional
  };

    function extractAmazonProductId(url: string): string | null {
      const match = url.match(/\/dp\/([A-Z0-9]{10})/);
      return match ? match[1] : null;
    }

  try {
    const response = await axios.get(details.url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Connection': 'keep-alive',
      },
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch page. Status code: ${response.status}`);
    }

    const $ = cheerio.load(response.data);
    const el = $(details.main_container).first();

    const title = el.find(details.title).text().trim();
    const price = el.find(details.price).text().trim();
    const image = el.find(details.image).attr('src')?.trim() || '';
    const link = el.find(details.link).attr('href')?.trim() || '';
    const realPrice = details.real_price ? el.find(details.real_price).text().trim() : null;


   const productId = extractAmazonProductId(link);

    if (title && price && image) {
      return [
        {
          title: `🔥 Live Deal: ${title}`,
          price,
          source: details.source,
          create_date: new Date(),
          image,
          real_price: realPrice,
          redirect_url:`https://www.amazon.in/dp/${productId}/?tag=bablu_22`
        },
      ];
    }
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error(`❌ Error scraping ${details.source} (${details.url}):`, error.message);
  } else {
    console.error(`❌ Unknown error scraping ${details.source} (${details.url}):`, error);
  }
}
  // 🔁 Always return an array, even if empty
  return [];
}


// // Flipkart scraper
// async function scrapeFlipkart(): Promise<Product[]> {
//   // Flipkart specific scraping logic here
//   return [];  // products from flipkart
// }

// // Snapdeal scraper
// async function scrapeSnapdeal(): Promise<Product[]> {
//   // Snapdeal specific scraping logic here
//   return [];  // products from snapdeal
// }

// Main function
async function scrapeAllStores(): Promise<Product[]> {
  const [amazonProducts] = await Promise.all([
    scrapeAmazon(),
    
  
  ]);

  return [...amazonProducts];
}

// Usage example
(async () => {
  const allProducts = await scrapeAllStores();
  console.log('Total Products:', allProducts.length);
})();
